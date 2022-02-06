import type { Document } from "mongoose";
import joi from "joi";
import {
    MembershipModel,
    UserModel,
    constants,
    BadRequestError,
    NotFoundError,
    OrganizationModel,
    ExternalMembership,
    runAsTransaction,
    sendEmail,
} from "@hypertool/common";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import { invitationTemplate } from "../utils";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const INVITATION_JWT_SIGNATURE = process.env.INVITATION_JWT_SIGNATURE;
sgMail.setApiKey(SENDGRID_API_KEY);

const createSchema = joi.object({
    emailAddress: joi.string().email().required(),
    organizationId: joi.string().regex(constants.identifierPattern),
});

const toExternal = (membership: any): ExternalMembership => {
    const {
        id,
        _id,
        member,
        inviter,
        division,
        type,
        status,
        createdAt,
        updatedAt,
    } = membership;
    return {
        id: id || _id.toString(),
        member,
        inviter,
        division,
        type,
        status,
        createdAt,
        updatedAt,
    };
};

const create = async (context, attributes): Promise<ExternalMembership> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const { emailAddress, organizationId } = value;
    let member = await UserModel.findOne({ emailAddress });

    if (!member) {
        const newUser = new UserModel({
            firstName: "<unavailable>",
            lastName: "<unavailable>",
            description: "<unavailable>",
            gender: undefined,
            countryCode: undefined,
            emailAddress: emailAddress,
            emailVerified: true,
            status: "invited",
            role: "viewer",
        });

        await newUser.save();
        member = newUser;
    }

    let membership = await MembershipModel.findOne({
        member: member.id,
        organizationId,
    });

    if (!membership) {
        const newMembership = new MembershipModel({
            member: member.id,
            inviter: "61fcf3cd1ca8c8033509f728",
            division: organizationId,
            type: "organization",
            status: "invited",
        });
        await newMembership.save();
        membership = newMembership;
    }

    if (membership.status === "invited") {
        const token = jwt.sign(
            { emailAddress, organizationId },
            INVITATION_JWT_SIGNATURE,
            {
                expiresIn: 60 * 60,
            },
        );
        const subject = "";
        const text = "";
        const html = invitationTemplate(token);
        sendEmail(emailAddress, subject, text, html);
    }

    return toExternal(membership);
};

const verify = async (context, token): Promise<Boolean> => {
    try {
        const { emailAddress, organizationId } = jwt.verify(
            token,
            INVITATION_JWT_SIGNATURE,
        );

        await runAsTransaction(async () => {
            const user = await UserModel.findOneAndUpdate(
                { emailAddress },
                {
                    $set: { organization: organizationId },
                },
                { new: true },
            );

            await MembershipModel.findOneAndUpdate(
                {
                    member: user.id,
                    organizationId,
                },
                {
                    status: "accepted",
                },
            );

            await OrganizationModel.findByIdAndUpdate(
                organizationId,
                { $push: { members: user.id } },
                { safe: true, upsert: true },
            );
        });

        return true;
    } catch (error) {
        //throw new BadRequestError(error.message);
        return false;
    }
};

export { create, verify };

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
} from "@hypertool/common";
import jwt from "jsonwebtoken";

import { invitationTemplate, sendEmail } from "../utils";

const { INVITATION_JWT_SIGNATURE } = process.env;

const createSchema = joi.object({
    emailAddress: joi.string().email().required(),
    organizationId: joi.string().regex(constants.identifierPattern),
    inviterId: joi.string().regex(constants.identifierPattern),
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

    const { emailAddress, organizationId, inviterId } = value;
    let member = await UserModel.findOne({ emailAddress });

    if (!member) {
        member = new UserModel({
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

        await member.save();
    }

    let membership = await MembershipModel.findOne({
        member: member._id,
        division: organizationId,
    });

    if (membership) {
        await invite(emailAddress, organizationId);
        throw new BadRequestError(
            "User is trying to create duplicate invitation.",
        );
    }

    membership = new MembershipModel({
        member: member._id,
        inviter: inviterId,
        division: organizationId,
        type: "organization",
        status: "invited",
    });

    await membership.save();

    await invite(emailAddress, organizationId);

    return toExternal(membership);
};

const invite = async (emailAddress, organizationId) => {
    const token = jwt.sign(
        { emailAddress, organizationId },
        INVITATION_JWT_SIGNATURE,
        {
            expiresIn: 60 * 60, // 1 hour
        },
    );
    const params = {
        from: { name: "Hypertool", email: "noreply@hypertool.io" },
        to: emailAddress,
        subject: "Invitation to join organization",
        text: "Text",
        html: await invitationTemplate({ token }),
    };
    await sendEmail(params);
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
                    member: user._id,
                    division: organizationId,
                },
                {
                    status: "accepted",
                },
            );

            await OrganizationModel.findByIdAndUpdate(
                organizationId,
                { $push: { members: user._id } },
                { safe: true },
            );
        });

        return true;
    } catch (error) {
        return false;
    }
};

export { create, verify };

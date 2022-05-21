import type {
    IExternalOrganization,
    TOrganizationPage,
} from "@hypertool/common";
import {
    BadRequestError,
    NotFoundError,
    OrganizationModel,
    UserModel,
    constants,
    extractIds,
    runAsTransaction,
} from "@hypertool/common";

import joi from "joi";
import jwt from "jsonwebtoken";
import mongoose, { ClientSession } from "mongoose";

import { renderTemplate, sendEmail } from "../utils";

const { INVITATION_JWT_SIGNATURE } = process.env;

const createSchema = joi.object({
    name: joi.string().max(256).allow(""),
    title: joi.string().max(512).allow(""),
    description: joi.string().max(512).allow(""),
    members: joi.array().items(
        joi.object({
            user: joi.string().regex(constants.identifierPattern),
            role: joi.string().valid(...constants.organizationRoles),
        }),
    ),
    apps: joi.array().items(joi.string().regex(constants.identifierPattern)),
    teams: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const filterSchema = joi.object({
    page: joi.number().integer().default(0),
    limit: joi
        .number()
        .integer()
        .min(constants.paginateMinLimit)
        .max(constants.paginateMaxLimit)
        .default(constants.paginateMinLimit),
});

const updateSchema = joi.object({
    name: joi.string().max(256).allow(""),
    title: joi.string().max(512).allow(""),
    description: joi.string().max(512).allow(""),
    members: joi.array().items(
        joi.object({
            user: joi.string().regex(constants.identifierPattern),
            role: joi.string().valid(...constants.organizationRoles),
        }),
    ),
    apps: joi.array().items(joi.string().regex(constants.identifierPattern)),
    teams: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const inviteSchema = joi.object({
    emailAddress: joi.string().email().required(),
    organizationId: joi.string().regex(constants.identifierPattern),
});

const toExternal = (organization: any): IExternalOrganization => {
    const {
        id,
        _id,
        name,
        title,
        description,
        members,
        apps,
        teams,
        status,
        createdAt,
        updatedAt,
    } = organization;

    return {
        id: id || _id.toString(),
        name,
        title,
        description,
        members,
        apps: extractIds(apps),
        teams: extractIds(teams),
        status,
        createdAt,
        updatedAt,
    };
};

const create = async (context, attributes): Promise<IExternalOrganization> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    // Check if the organization with same name already exists.
    const filters = {
        name: value.name,
    };
    const existingOrganization = await OrganizationModel.findOne(
        filters,
    ).exec();

    if (existingOrganization) {
        throw new BadRequestError(
            `Organization with name "${value.name}" already exists.`,
        );
    }

    const newOrganization = new OrganizationModel({
        ...value,
        members: [
            {
                user: context.user._id,
                role: "owner",
                status: "activated",
            },
        ],
        status: "active",
    });
    await newOrganization.save();

    const users = await UserModel.findOneAndUpdate(
        {
            _id: context.user._id,
        },
        {
            $addToSet: {
                organizations: newOrganization._id,
            },
        },
        {
            new: true,
        },
    )
        .lean()
        .exec();

    return toExternal(newOrganization);
};

const list = async (context, parameters): Promise<TOrganizationPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const filters = {
        status: {
            $ne: "deleted",
        },
    };
    const { page, limit } = value;

    const organizations = await (OrganizationModel as any).paginate(filters, {
        limit,
        page: page + 1,
        lean: true,
        leanWithId: true,
        pagination: true,
        sort: {
            updatedAt: -1,
        },
    });

    return {
        totalRecords: organizations.totalDocs,
        totalPages: organizations.totalPages,
        previousPage: organizations.prevPage ? organizations.prevPage - 1 : -1,
        nextPage: organizations.nextPage ? organizations.nextPage - 1 : -1,
        hasPreviousPage: organizations.hasPrevPage,
        hasNextPage: organizations.hasNextPage,
        records: organizations.docs.map(toExternal),
    };
};

const listByIds = async (
    context,
    organizationIds: string[],
): Promise<IExternalOrganization[]> => {
    const unorderedOrganizations = await OrganizationModel.find({
        _id: { $in: organizationIds },
        status: { $ne: "deleted" },
    }).exec();

    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const organization of unorderedOrganizations) {
        object[organization._id.toString()] = organization;
    }
    return organizationIds.map((key) => toExternal(object[key]));
};

const getById = async (
    context,
    organizationId: string,
): Promise<IExternalOrganization> => {
    if (!constants.identifierPattern.test(organizationId)) {
        throw new BadRequestError(
            "The specified organization identifier is invalid.",
        );
    }

    // TODO: Update filters
    const filters = {
        _id: organizationId,
    };
    const group = await OrganizationModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the group. */
    if (!group) {
        throw new NotFoundError(
            "Cannot find an organization with the specified identifier.",
        );
    }

    return toExternal(group);
};

const update = async (
    context,
    organizationId: string,
    attributes,
): Promise<IExternalOrganization> => {
    if (!constants.identifierPattern.test(organizationId)) {
        throw new BadRequestError(
            "The specified organization identifier is invalid.",
        );
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Update filters
    const organization = await OrganizationModel.findOneAndUpdate(
        {
            _id: organizationId,
            status: { $ne: "deleted" },
        },
        value,
        {
            new: true,
            lean: true,
        },
    ).exec();

    if (!organization) {
        throw new NotFoundError(
            "An organization with the specified identifier does not exist.",
        );
    }

    return toExternal(organization);
};

const remove = async (
    context,
    organizationId: string,
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(organizationId)) {
        throw new BadRequestError(
            "The specified organization identifier is invalid.",
        );
    }

    // TODO: Update filters
    const organization = await OrganizationModel.findOneAndUpdate(
        {
            _id: organizationId,
            status: { $ne: "deleted" },
        },
        {
            status: "deleted",
        },
        {
            new: true,
            lean: true,
        },
    );

    if (!organization) {
        throw new NotFoundError(
            "An organization with the specified identifier does not exist.",
        );
    }

    return { success: true };
};

const invite = async (context, attributes): Promise<{ success: boolean }> => {
    const { error, value } = inviteSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const { emailAddress, organizationId } = value;
    let user = await UserModel.findOne({ emailAddress });
    let userId;

    if (!user) {
        userId = new mongoose.Types.ObjectId();
        user = new UserModel({
            _id: userId,
            firstName: "<unavailable>",
            lastName: "<unavailable>",
            description: "<unavailable>",
            gender: undefined,
            countryCode: undefined,
            emailAddress: emailAddress,
            emailVerified: true,
            status: "invited",
        });
        await user.save();
    } else {
        userId = user._id;
    }

    const existingInvitation = await OrganizationModel.findOne({
        organizationId,
        members: {
            $elemMatch: {
                user: userId,
                status: { $ne: "deleted" },
            },
        },
    });

    if (existingInvitation) {
        throw new BadRequestError("Cannot create a duplicate invitation.");
    }

    await OrganizationModel.findOneAndUpdate(
        {
            _id: organizationId,
            status: { $ne: "deleted" },
        },
        {
            $addToSet: {
                members: {
                    user: userId,
                    role: "member",
                    status: "invited",
                },
            },
        },
        {
            new: true,
            lean: true,
        },
    ).exec();

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
        html: await renderTemplate("invitation.html", { token }),
    };
    await sendEmail(params);

    return { success: true };
};

const join = async (context, token: string): Promise<Boolean> => {
    try {
        const { emailAddress, organizationId } = jwt.verify(
            token,
            INVITATION_JWT_SIGNATURE,
        );

        await runAsTransaction(async (session: ClientSession) => {
            const user = await UserModel.findOneAndUpdate(
                {
                    emailAddress,
                },
                {
                    $addToSet: {
                        organizations: organizationId,
                    },
                },
                {
                    new: true,
                    lean: true,
                    session,
                },
            ).exec();

            await OrganizationModel.findOneAndUpdate(
                {
                    _id: organizationId,
                    status: { $ne: "deleted" },
                    members: { $elemMatch: { user: user._id } },
                },
                {
                    $set: {
                        "members.$.status": "active",
                    },
                },
                {
                    new: true,
                    lean: true,
                    session,
                },
            ).exec();
        });

        return true;
    } catch (error) {
        return false;
    }
};

const leave = async (context, attributes): Promise<{ success: boolean }> => {
    const { error, value } = inviteSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const { emailAddress, organizationId } = value;

    await runAsTransaction(async (session: ClientSession) => {
        const user = await UserModel.findOneAndUpdate(
            {
                emailAddress,
            },
            {
                $pull: {
                    organizations: organizationId,
                },
            },
            {
                new: true,
                lean: true,
                session,
            },
        ).exec();

        await OrganizationModel.findOneAndUpdate(
            {
                _id: organizationId,
                status: { $ne: "deleted" },
                members: { $elemMatch: { user: user._id } },
            },
            {
                $pull: {
                    members: {
                        user: user._id,
                    },
                },
            },
            {
                new: true,
                lean: true,
                session,
            },
        ).exec();
    });

    return { success: true };
};

export {
    create,
    list,
    listByIds,
    getById,
    update,
    remove,
    invite,
    join,
    leave,
};

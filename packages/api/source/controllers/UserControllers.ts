import type { Document } from "mongoose";
import type { User, UserPage, ExternalUser, Session } from "@hypertool/common";

import joi from "joi";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
    constants,
    google,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    extractIds,
    UserModel,
} from "@hypertool/common";

const createSchema = joi.object({
    firstName: joi.string().min(1).max(256).required(),
    lastName: joi.string().min(1).max(256).required(),
    description: joi.string().max(512).allow(""),
    organization: joi.string().regex(constants.identifierPattern),
    gender: joi.string().valid(...constants.genders),
    countryCode: joi.string().valid(...constants.countryCodes),
    pictureURL: joi.string().allow(""),
    emailAddress: joi.string().max(256).required(),
    birthday: joi.date().allow(null),
    role: joi.string().valid(...constants.userRoles),
    groups: joi.array().items(joi.string().regex(constants.identifierPattern)),
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

// TODO: Changing email address and organization should have their own controllers.

const updateSchema = joi.object({
    firstName: joi.string().min(1).max(256),
    lastName: joi.string().min(1).max(256),
    description: joi.string().max(512).allow(""),
    organization: joi.string().regex(constants.identifierPattern),
    gender: joi.string().valid(...constants.genders),
    countryCode: joi.string().valid(...constants.countryCodes),
    pictureURL: joi.string().allow(""),
    birthday: joi.date().allow(null),
    role: joi.string().valid(...constants.userRoles),
    groups: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const toExternal = (user: any): ExternalUser => {
    const {
        id,
        _id,
        firstName,
        lastName,
        description,
        organization,
        gender,
        countryCode,
        pictureURL,
        emailAddress,
        emailVerified,
        birthday,
        status,
        role,
        groups,
        createdAt,
        updatedAt,
    } = user;

    return {
        id: id || _id.toString(),
        firstName,
        lastName,
        description,
        organization,
        gender,
        countryCode,
        pictureURL,
        emailAddress,
        emailVerified,
        birthday,
        status,
        role,
        groups: extractIds(groups),
        createdAt,
        updatedAt,
    };
};

const create = async (context, attributes): Promise<ExternalUser> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const newUser = new UserModel({
        ...value,
        status: "activated",
    });
    await newUser.save();

    return toExternal(newUser);
};

const list = async (context, parameters): Promise<UserPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Update filters
    const filters = {
        status: {
            $ne: "cancelled",
        },
    };
    const { page, limit } = value;

    const users = await (UserModel as any).paginate(filters, {
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
        totalRecords: users.totalDocs,
        totalPages: users.totalPages,
        previousPage: users.prevPage ? users.prevPage - 1 : -1,
        nextPage: users.nextPage ? users.nextPage - 1 : -1,
        hasPreviousPage: users.hasPrevPage,
        hasNextPage: users.hasNextPage,
        records: users.docs.map(toExternal),
    };
};

const listByIds = async (
    context,
    userIds: string[],
): Promise<ExternalUser[]> => {
    const unorderedUsers = await UserModel.find({
        _id: { $in: userIds },
        status: { $ne: "cancelled" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const user of unorderedUsers) {
        object[user._id.toString()] = user;
    }
    // eslint-disable-next-line security/detect-object-injection
    return userIds.map((key) => toExternal(object[key]));
};

const getById = async (context, userId: string): Promise<ExternalUser> => {
    if (!constants.identifierPattern.test(userId)) {
        throw new BadRequestError("The specified user identifier is invalid.");
    }

    // TODO: Update filters
    const filters = {
        _id: userId,
        status: { $ne: "cancelled" },
    };
    const user = await UserModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the user. */
    if (!user) {
        throw new NotFoundError(
            "Cannot find a user with the specified identifier.",
        );
    }

    return toExternal(user);
};

const update = async (
    context,
    userId: string,
    attributes,
): Promise<ExternalUser> => {
    if (!constants.identifierPattern.test(userId)) {
        throw new BadRequestError("The specified user identifier is invalid.");
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Update filters
    const user = await UserModel.findOneAndUpdate(
        {
            _id: userId,
            status: { $ne: "removed" },
        },
        value,
        {
            new: true,
            lean: true,
        },
    ).exec();

    if (!user) {
        throw new NotFoundError(
            "A user with the specified identifier does not exist.",
        );
    }

    return toExternal(user);
};

const remove = async (
    context,
    userId: string,
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(userId)) {
        throw new BadRequestError("The specified user identifier is invalid.");
    }

    // TODO: Update filters
    const user = await UserModel.findOneAndUpdate(
        {
            _id: userId,
            status: { $ne: "removed" },
        },
        {
            status: "removed",
        },
        {
            new: true,
            lean: true,
        },
    );

    if (!user) {
        throw new NotFoundError(
            "A user with the specified identifier does not exist.",
        );
    }

    return { success: true };
};

const loginWithGoogle = async (
    context: any,
    authorizationToken: string,
    client: typeof constants.googleClientTypes[number],
): Promise<Session> => {
    const payload = await google.getUserInfo(authorizationToken, client);

    if (!payload) {
        throw new UnauthorizedError(
            "The specified Google authorization token is invalid.",
        );
    }

    const {
        given_name: firstName,
        family_name: lastName,
        picture: pictureURL,
        email: emailAddress,
        email_verified: emailVerified,
    } = payload;

    /* Find if the user is already registered. */
    let user = await UserModel.findOne({ emailAddress }).exec();

    /* If it's a new user, create the user. */
    if (!user) {
        const _id = new mongoose.Types.ObjectId();
        /* Looks like this is the first time the user is accessing the service. Therefore,
         * we need to create a profile with default values for the user.
         */
        user = new UserModel({
            _id,
            firstName,
            lastName,
            gender: undefined,
            countryCode: undefined,
            pictureURL,
            emailAddress,
            emailVerified,
            role: "owner",
            birthday: null,
            status: "activated",
        });
        await user.save();
    }

    if (!user.emailVerified && emailVerified) {
        /* If the email address has been verified since the last session,
         * update it.
         */
        user.emailVerified = true;
        await user.save();
    }

    /* Create token */
    const jwtToken = jwt.sign({ emailAddress }, process.env.JWT_SIGNATURE_KEY, {
        expiresIn: "30d",
    });

    return { jwtToken, user, createdAt: new Date() };
};

export { create, list, listByIds, getById, update, remove, loginWithGoogle };

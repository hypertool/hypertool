import joi from "joi";

import type { User, UserPage, ExternalUser } from "../types";

import { constants, googleUtils, BadRequestError, NotFoundError, UnauthorizedError } from "../utils";
import { UserModel } from "../models";

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
    gender: joi.string().valid(...constants.genders),
    countryCode: joi.string().valid(...constants.countryCodes),
    pictureURL: joi.string().allow(""),
    birthday: joi.date().allow(null),
    role: joi.string().valid(...constants.userRoles),
    groups: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const toExternal = (user: User): ExternalUser => {
    const {
        id,
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
        id,
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
        groups:
            groups.length > 0
                ? typeof groups[0] === "string"
                    ? groups
                    : groups.map((group) => group.id)
                : [],
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
    userIds: string[]
): Promise<ExternalUser[]> => {
    const unorderedUsers = await UserModel.find({
        _id: { $in: userIds },
        status: { $ne: "cancelled" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const user of unorderedUsers) {
        object[user._id] = user;
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
            "Cannot find a user with the specified identifier."
        );
    }

    return toExternal(user);
};

const update = async (
    context,
    userId: string,
    attributes
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
        }
    ).exec();

    if (!user) {
        throw new NotFoundError(
            "A user with the specified identifier does not exist."
        );
    }

    return toExternal(user);
};

const remove = async (
    context,
    userId: string
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
        }
    );

    if (!user) {
        throw new NotFoundError(
            "A user with the specified identifier does not exist."
        );
    }

    return { success: true };
};

const loginWithGoogle = async (context, token: string): Promise<{ jwtToken: string }> => {
    const payload = await googleUtils.verifyToken(token);

    if (!payload) {
        throw new UnauthorizedError(
            "The google authorization token you have sent is invalid."
        );
    }

    const {
        given_name: firstName,
        family_name: lastName,
        picture: pictureURL,
        email: emailAddress,
    } = payload;

    // Find if the user is already registered.
    const user = await UserModel.findOne(emailAddress).exec();

    // If it's a new user, create the user.
    if (!user) {
        const newUser = new UserModel({
            firstName,
            lastName,
            pictureURL,
            emailAddress,
            organization: null,
            status: "activated",
        });
        await newUser.save();
    }

    // Create token
    const jwtToken = jwt.sign(
        { emailAddress },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );

    return { jwtToken };
}

export { create, list, listByIds, getById, update, remove, loginWithGoogle };

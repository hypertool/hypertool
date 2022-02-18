import type { Document } from "mongoose";
import type { User, UserPage, ExternalUser, Session } from "@hypertool/common";

import joi from "joi";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    verifyEmailTemplate,
    sendEmail,
    resetPasswordTemplate,
} from "../utils";

import {
    constants,
    google,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    extractIds,
    UserModel,
    AppModel,
} from "@hypertool/common";
import { createToken, hashPassword } from "../utils";

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
    password: joi.string().min(8).max(128),
    description: joi.string().max(512).allow(""),
    organization: joi.string().regex(constants.identifierPattern),
    gender: joi.string().valid(...constants.genders),
    countryCode: joi.string().valid(...constants.countryCodes),
    pictureURL: joi.string().allow(""),
    birthday: joi.date().allow(null),
    role: joi.string().valid(...constants.userRoles),
    groups: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signUpWithPasswordSchema = joi.object({
    firstName: joi.string().min(1).max(256).required(),
    lastName: joi.string().min(1).max(256).required(),
    emailAddress: joi.string().max(256).required(),
    password: joi.string().regex(passwordRegex).min(8).max(128).required(),
    role: joi.string().valid(constants.userRoles).required(),
});

const loginWithEmailSchema = joi.object({
    emailAddress: joi.string().max(256).required(),
    password: joi.string().regex(passwordRegex).min(8).max(128).required(),
});

const requestPasswordResetSchema = joi.object({
    emailAddress: joi.string().max(256).required(),
    appId: joi.string().required(),
});

const completePasswordResetSchema = joi.object({
    token: joi.string().max(256).required(),
    newPassword: joi.string().regex(passwordRegex).min(8).max(128).required(),
});

const updatePasswordSchema = joi.object({
    oldPassword: joi.string().regex(passwordRegex).min(8).max(128).required(),
    newPassword: joi.string().regex(passwordRegex).min(8).max(128).required(),
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
    const jwtToken = createToken(emailAddress, "30d");

    return { jwtToken, user: toExternal(user), createdAt: new Date() };
};

const signupWithEmail = async (
    context: any,
    values: any,
): Promise<ExternalUser> => {
    const { error, value } = signUpWithPasswordSchema.validate(values, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const { firstName, lastName, emailAddress, role, password } = values;

    let user = await UserModel.findOne({ emailAddress }).exec();

    if (user) {
        throw new BadRequestError("User is already signed up");
    }

    user = new UserModel({
        firstName,
        lastName,
        password: hashPassword(password),
        gender: undefined,
        countryCode: undefined,
        pictureURL: undefined,
        emailAddress,
        emailVerified: false,
        role,
        birthday: null,
        status: "activated",
    });
    await user.save();

    const token = createToken(emailAddress, "7d");

    const params = {
        from: { name: "Hypertool", email: "noreply@hypertool.io" },
        to: emailAddress,
        subject: "Verify your Hypertool email address",
        text: "Text",
        html: await verifyEmailTemplate({ token }),
    };

    await sendEmail(params);

    return toExternal(user);
};

const loginWithEmail = async (context: any, values: any): Promise<Session> => {
    const { error, value } = loginWithEmailSchema.validate(values, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { emailAddress, password } = values;
    let user = await UserModel.findOne({ emailAddress }).exec();

    if (!user) {
        throw new NotFoundError("User not found");
    }

    if (!user.emailVerified) {
        throw new UnauthorizedError("User email is not verified");
    }

    const passwordMatched = bcrypt.compare(password, user.password);

    if (!passwordMatched) {
        throw new UnauthorizedError("Email and Password not matched");
    }

    const jwtToken = createToken(emailAddress, "30d");

    return { jwtToken, user: toExternal(user), createdAt: new Date() };
};

const updatePassword = async (
    context: any,
    values: any,
): Promise<ExternalUser> => {
    const { error, value } = updatePasswordSchema.validate(values, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { oldPassword, newPassword } = values;

    let user = context.user;

    const passwordMatched = bcrypt.compare(oldPassword, user.password);
    if (!passwordMatched) {
        throw new Error("Old password is incorrect");
    }

    user.password = hashPassword(newPassword);
    user.save();

    return toExternal(user);
};

const requestPasswordReset = async (
    context: any,
    values: any,
): Promise<any> => {
    const { error, value } = requestPasswordResetSchema.validate(values, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { emailAddress, appId } = values;

    let app = await AppModel.findById(appId);
    let organizationId = app.organization;

    const jwtToken = jwt.sign(
        { emailAddress, organizationId },
        process.env.JWT_SIGNATURE_KEY,
        {
            expiresIn: "600s" /* 10 minutes */,
        },
    );

    const url = `https://${app.name}.hypertool.io/new-password?token=${jwtToken}`;

    const params = {
        from: { name: "Hypertool", email: "noreply@hypertool.io" },
        to: emailAddress,
        subject: "Password Reset Link",
        text: "Text",
        html: await resetPasswordTemplate({ url }),
    };

    await sendEmail(params);

    return {
        message: "The reset link was sent to the specific email address",
        success: true,
    };
};

const completePasswordReset = async (
    context: any,
    values: any,
): Promise<Session> => {
    const { error, value } = completePasswordResetSchema.validate(values, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { token, newPassword } = values;

    const { emailAddress, organizationId } = jwt.verify(
        token,
        process.env.JWT_SIGNATURE_KEY,
    );
    /* To Do */
    /* How to check if jwt is expired */

    let user = await UserModel.findOne({ emailAddress }).exec();

    /* Check weather the user is inside the given organzation */
    let ifUserInOrganization = user.organizations.includes(organizationId);
    if (!ifUserInOrganization) {
        throw new NotFoundError("User is not in the organization");
    }

    /* When all checks are passed */
    user.password = hashPassword(newPassword);
    await user.save();

    const jwtToken = createToken(emailAddress, "30d");

    return { jwtToken, user: toExternal(user), createdAt: new Date() };
};

export {
    create,
    list,
    listByIds,
    getById,
    update,
    remove,
    loginWithGoogle,
    signupWithEmail,
    loginWithEmail,
    updatePassword,
    requestPasswordReset,
    completePasswordReset,
};

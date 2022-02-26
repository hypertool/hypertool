import type { ExternalUser, Session, UserPage } from "@hypertool/common";
import {
    AppModel,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    UserModel,
    constants,
    extractIds,
    google,
} from "@hypertool/common";

import bcrypt from "bcrypt";
import joi from "joi";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { createToken, hashPassword, renderTemplate, sendEmail } from "../utils";

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

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signUpWithEmailSchema = joi.object({
    firstName: joi.string().min(1).max(256).required(),
    lastName: joi.string().min(1).max(256).required(),
    emailAddress: joi.string().max(256).required(),
    password: joi.string().regex(passwordRegex).min(8).max(128).required(),
    role: joi
        .string()
        .valid(...constants.userRoles)
        .required(),
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
    ).exec();

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
    const jwtToken = createToken({ emailAddress }, "30d");

    return { jwtToken, user: toExternal(user), createdAt: new Date() };
};

const signupWithEmail = async (
    context: any,
    attributes: any,
): Promise<ExternalUser> => {
    const { error, value } = signUpWithEmailSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const { firstName, lastName, emailAddress, role, password } = value;

    let user = await UserModel.findOne({ emailAddress }).exec();
    if (user) {
        throw new BadRequestError(
            "A user with the specified email address already exists.",
        );
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

    const token = createToken({ emailAddress }, "7d");
    const verificationURL = `http://localhost:3001/api/v1/users/verify/${token}`;
    const params = {
        from: { name: "Hypertool", email: "noreply@hypertool.io" },
        to: emailAddress,
        subject: "Verify your Hypertool email address",
        text: `Open the following link to validate your email address: ${verificationURL}`,
        html: await renderTemplate("verify-email.html", {
            verificationURL,
        }),
    };
    await sendEmail(params);

    return toExternal(user);
};

const loginWithEmail = async (
    context: any,
    attributes: any,
): Promise<Session> => {
    const { error, value } = loginWithEmailSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { emailAddress, password } = value;
    let user = await UserModel.findOne({ emailAddress }).exec();

    if (!user) {
        throw new NotFoundError(
            "Cannot find a user with the specified email address.",
        );
    }

    if (!user.emailVerified) {
        throw new UnauthorizedError(
            "The user with the specified email address is not verified.",
        );
    }

    if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedError(
            "The specified email address or password is invalid.",
        );
    }

    return {
        jwtToken: createToken({ emailAddress }, "30d"),
        user: toExternal(user),
        createdAt: new Date(),
    };
};

const updatePassword = async (
    context: any,
    attributes: any,
): Promise<ExternalUser> => {
    const { error, value } = updatePasswordSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { oldPassword, newPassword } = value;
    if (!(await bcrypt.compare(oldPassword, context.user.password))) {
        throw new Error("The specified old password is incorrect.");
    }

    const user = await UserModel.findOneAndUpdate(
        {
            _id: context.user._id,
        },
        {
            password: hashPassword(newPassword),
        },
        {
            new: true,
            lean: true,
        },
    ).exec();

    return toExternal(user);
};

const requestPasswordReset = async (
    context: any,
    attributes: any,
): Promise<any> => {
    const { error, value } = requestPasswordResetSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { emailAddress, appId } = value;
    const app = await AppModel.findById(appId);

    /* Make sure that the user with the specified email address is registered
     * on the app.
     */
    /* TODO: organizations.includes(app.organization) --> The user of the app
     * should also be part of the organization! This is different from being
     * a registered user of the app. We need to figure out another way to associate
     * registered users of an app with the owning organization.
     *
     * User -> App -> Organization
     */
    const user = await UserModel.findOne({
        emailAddress,
        organizations: { $in: app.organization },
    }).exec();
    if (!user) {
        throw new NotFoundError(
            "Cannot find a user with specified email address.",
        );
    }

    const jwtToken = createToken(
        { emailAddress, organizationId: app.organization },
        "600s" /* 10 minutes */,
    );
    const url = `https://${app.name}.hypertool.io/new-password?token=${jwtToken}`;
    const params = {
        from: { name: "Hypertool", email: "noreply@hypertool.io" },
        to: emailAddress,
        subject: "Password Reset Link",
        text: `Open the following link to reset your password; ${url}`,
        html: await renderTemplate("reset-password.html", { url }),
    };
    await sendEmail(params);

    return {
        message: "A reset link was sent to the specified email address.",
        success: true,
    };
};

const completePasswordReset = async (
    context: any,
    attributes: any,
): Promise<Session> => {
    const { error, value } = completePasswordResetSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { token, newPassword } = value;
    /* TODO: Check if the JWT token has expired. */
    const { emailAddress, organizationId } = jwt.verify(
        token,
        process.env.JWT_SIGNATURE_KEY,
    );

    const user = await UserModel.findOneAndUpdate(
        {
            emailAddress,
            organizations: { $in: organizationId },
        },
        {
            password: hashPassword(newPassword),
        },
        {
            new: true,
            lean: true,
        },
    ).exec();
    if (!user) {
        throw new NotFoundError(
            "Cannot find a user with specified email address. (Inconsistent data state; possibly a bug.)",
        );
    }

    return {
        jwtToken: createToken({ emailAddress }, "30d"),
        user: toExternal(user),
        createdAt: new Date(),
    };
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

const joi = require("joi");
const mongoose = require("mongoose");
const { subMonths, startOfDay, endOfDay } = require("date-fns");

import type { User } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { UserModel } from "../models";

const {
    languageCodes,
    paginateMaxLimit,
    identifierPattern,
    genders,
    countryCodes,
} = require("../util/constants");

const toExternal = (user) => {
    const {
        id,
        firstName,
        lastName,
        userName,
        gender,
        countryCode,
        pictureURL,
        emailAddress,
        emailVerified,
        roles,
        birthday,
        interests,
        contentLanguageCodes,
        displayLanguageCode,
        about,
        createdAt,
        updatedAt,
    } = user;

    return {
        id,
        firstName,
        lastName,
        userName,
        gender,
        countryCode,
        pictureURL,
        emailAddress,
        emailVerified,
        roles,
        birthday,
        interests,
        contentLanguageCodes,
        displayLanguageCode,
        about,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
    };
};

// TODO: Test null values
/* NOTE: The following schema is used by `PATCH /users/:id` endpoint. Default values will cause
 * existing values to be replaced when persisting to the database. Do not specify default values
 * in the schema unless you know what you are doing.
 */
const updateSchema = joi.object({
    firstName: joi.string().trim(),
    lastName: joi.string().trim(),
    gender: joi.string().valid(...genders),
    countryCode: joi.string().valid(...countryCodes),
    birthday: joi.date(),
    contentLanguageCodes: joi
        .array()
        .items(joi.string().valid(...languageCodes)),
    displayLanguageCode: joi.string().valid(...languageCodes),
    about: joi.string().min(0).max(512).trim(),
});

const filterSchema = joi.object({
    page: joi.number().integer().default(0),
    limit: joi.number().integer().min(10).max(paginateMaxLimit).default(20),
    dateRange: joi
        .string()
        .valid(
            "all_time",
            "last_3_months",
            "last_6_months",
            "last_9_months",
            "last_12_months",
            "last_15_months",
            "last_18_months",
            "custom"
        )
        .default("all_time"),
    startDate: joi
        .date()
        .when("date_range", { is: "custom", then: joi.required() }),
    endDate: joi
        .date()
        .when("date_range", { is: "custom", then: joi.required() }),
    search: joi.string().trim().allow(null).empty("").default(null),
});

// TODO: Should we implement a transaction here?
const create = async (context, payload) => {
    const { firstName, lastName, pictureURL, emailVerified, emailAddress } =
        payload;

    let user = await UserModel.findOne({
        emailAddress,
    }).exec();

    if (!user) {
        const _id = new mongoose.Types.ObjectId();
        /* Looks like this is the first time the user is accessing the service. Therefore,
         * we need to create a profile with default values for the user.
         */
        user = new UserModel({
            _id,
            firstName,
            lastName,
            userName: _id,
            gender: undefined,
            countryCode: undefined,
            pictureURL,
            emailAddress,
            emailVerified,
            roles: ["regular"],
            birthday: null,
            interests: [],
            contentLanguageCodes: ["en"],
            displayLanguageCode: "en",
            status: "active",
            about: "",
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
    return toExternal(user);
};

const getById = async (context, userId) => {
    if (!identifierPattern.test(userId)) {
        throw new BadRequestError("The specified user identifier is invalid.");
    }

    const filters = { _id: userId };
    const user = await UserModel.findOne(filters).exec();

    /* We return a 404 error:
     * 1. If we did not find the user.
     * 2. Or, we found the user, but it is deleted.
     */
    if (!user || user === "deleted") {
        throw new NotFoundError(
            "Cannot find a user with the specified identifier."
        );
    }

    return toExternal(user);
};

const update = async (context, userId, attributes) => {
    if (!identifierPattern.test(userId)) {
        throw new BadRequestError("The specified user identifier is invalid.");
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    /* The specified ID should be equal to the current user, meaning the user is trying to
     * modify their own account.
     */
    if (!userId.equals(context.user._id.toString())) {
        throw new NotFoundError("The specified user identifier is invalid.");
    }

    const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, value)
        .lean()
        .exec();

    /* As of this writing, we check if the specified ID belongs to the current user.
     * Therefore, `updatedUser` will never be null. However, in the future when we implement
     * administrative permissions to update user data, we need to check if the specified
     * ID exists or not. I pre-writing the logic for it now.
     */
    if (!updatedUser) {
        throw new NotFoundError("The specified user identifier is invalid.");
    }

    return toExternal(updatedUser);
};

const list = async (context, parameters) => {
    const { error, value } = filterSchema.validate(parameters, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    let { startDate, endDate } = value;
    const { dateRange } = value;
    if (dateRange !== "custom" && dateRange !== "all_time") {
        const months = {
            last_3_months: 3,
            last_6_months: 6,
            last_9_months: 9,
            last_12_months: 12,
            last_15_months: 15,
            last_18_months: 18,
        };
        /* eslint-disable-next-line security/detect-object-injection */
        const amount = months[dateRange];
        startDate = subMonths(new Date(), amount);
        endDate = new Date();
    }

    const filters = {
        // userName: { $exists: true }
    };
    if (dateRange !== "all_time") {
        filters.createdAt = {
            $gte: startOfDay(startDate),
            $lte: endOfDay(endDate),
        };
    }

    if (value.search) {
        /* eslint-disable-next-line security/detect-non-literal-regexp */
        const regex = new RegExp(escapeRegex(value.search), "i");
        filters.$or = [
            { firstName: regex },
            { lastName: regex },
            // Email address should match exactly, for privacy reasons.
            { emailAddress: value.search },
        ];
    }

    const users = await UserModel.paginate(filters, {
        limit: value.limit,
        page: value.page + 1,
        lean: true,
        leanWithId: true,
        pagination: true,
        sort: {
            createdAt: -1,
        },
    });

    return {
        totalRecords: users.totalDocs,
        page: value.page,
        limit: users.limit,
        totalPages: users.totalPages,
        previousPage: users.prevPage ? users.prevPage - 1 : null,
        nextPage: users.nextPage ? users.nextPage - 1 : null,
        hasPreviousPage: users.hasPrevPage,
        hasNextPage: users.hasNextPage,
        records: users.docs.map(toExternal),
    };
};

module.exports = {
    create,
    getById,
    update,
    list,
};
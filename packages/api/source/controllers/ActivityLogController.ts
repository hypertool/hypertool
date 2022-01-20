import type { Document } from "mongoose";
import joi from "joi";
import type { ActivityLog, ExternalActivityLog, ResourcePage } from "../types";
import { constants, BadRequestError, NotFoundError } from "../utils";
import { ActivityLogModel } from "../models";
const { componentOrigins } = constants;

const createSchema = joi.object({
    message: joi.string().max(512).min(1).required(),
    component: joi
        .string()
        .valid(...componentOrigins)
        .required(),
    context: joi
        .object({
            type: joi.string(),
        })
        .unknown(true),
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

const toExternal = (
    activityLog: ActivityLog & Document<ActivityLog>,
): ExternalActivityLog => {
    const { _id, id, message, component, context, createdAt, updatedAt } =
        activityLog;
    return {
        id: id || _id.toString(),
        message,
        component,
        context,
        createdAt,
        updatedAt,
    };
};

const create = async (context, attributes): Promise<ExternalActivityLog> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const newActivityLog = new ActivityLogModel({ ...value });

    await newActivityLog.save();

    return toExternal(newActivityLog);
};

export { create };

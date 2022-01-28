import type { Document } from "mongoose";
import type {
    ActivityLog,
    ExternalActivityLog,
    ActivityLogPage,
} from "@hypertool/common";

import joi from "joi";
import {
    ActivityLogModel,
    constants,
    BadRequestError,
    NotFoundError,
} from "@hypertool/common";

const createSchema = joi.object({
    message: joi.string().max(512).min(1).required(),
    component: joi
        .string()
        .valid(...constants.componentOrigins)
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

const toExternal = (activityLog: any): ExternalActivityLog => {
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

const getById = async (
    context,
    activityLogId: string,
): Promise<ExternalActivityLog> => {
    const activityLog = await ActivityLogModel.findById(activityLogId);

    if (!activityLog) {
        throw new NotFoundError(
            "Cannot find an activityLog with the specified id.",
        );
    }

    return toExternal(activityLog);
};

const list = async (context, parameters): Promise<ActivityLogPage> => {
    const { error, value } = filterSchema.validate(parameters);

    if (error) {
        throw new BadRequestError(error.message);
    }

    const { page, limit } = value;

    const activityLogs = await (ActivityLogModel as any).paginate(
        {},
        {
            limit,
            page: page + 1,
            lean: true,
            leanWithId: true,
            pagination: true,
            sort: {
                updatedAt: -1,
            },
        },
    );

    return {
        totalRecords: activityLogs.totalDocs,
        totalPages: activityLogs.totalPages,
        previousPage: activityLogs.prevPage ? activityLogs.prevPage - 1 : -1,
        nextPage: activityLogs.nextPage ? activityLogs.nextPage - 1 : -1,
        hasPreviousPage: activityLogs.hasPrevPage,
        hasNextPage: activityLogs.hasNextPage,
        records: activityLogs.docs.map(toExternal),
    };
};

export { create, getById, list };

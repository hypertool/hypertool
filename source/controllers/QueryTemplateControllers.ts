import joi from "joi";

import type { Query, ExternalQuery } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { QueryTemplateModel } from "../models";

const toExternal = (query: Query): ExternalQuery => {
    const {
        id,
        name,
        description,
        resource,
        app,
        content,
        status,
        lifecycle,
        createdAt,
        updatedAt,
    } = query;

    return {
        id,
        name,
        description,
        resource,
        app,
        content,
        status,
        lifecycle,
        createdAt,
        updatedAt,
    };
};

const listByIds = async (context, ids: string[]): Promise<ExternalQuery[]> => {
    const unorderedQueries = await QueryTemplateModel.find({
        _id: { $in: ids },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const query of unorderedQueries) {
        object[query._id] = query;
    }
    // eslint-disable-next-line security/detect-object-injection
    return ids.map((key) => toExternal(object[key]));
};

const listByAppIds = async (
    context,
    appIds: string[]
): Promise<ExternalQuery[]> => {
    const unorderedQueries = await QueryTemplateModel.find({
        app: { $in: appIds },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const query of unorderedQueries) {
        object[query._id] = query;
    }
    // eslint-disable-next-line security/detect-object-injection
    return appIds.map((key) => toExternal(object[key]));
};

export { listByIds, listByAppIds };

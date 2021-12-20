import joi from "joi";

import type { Query, ExternalQuery, QueryPage } from "../types";
import { constants, BadRequestError, NotFoundError } from "../utils";
import { QueryTemplateModel } from "../models";

const createSchema = joi.object({
    name: joi.string().max(128).required(),
    description: joi.string().max(1024).allow(""),
    resource: joi.string().regex(constants.identifierPattern),
    app: joi.string().regex(constants.identifierPattern),
    content: joi.string().max(10240).required(),
    lifecycle: joi.string().valid(...constants.queryLifecycleTypes),
});

const updateSchema = joi.object({
    name: joi.string().max(128),
    description: joi.string().max(1024).allow(""),
    content: joi.string().max(10240),
});

const filterSchema = joi.object({
    page: joi.number().integer().default(0),
    limit: joi
        .number()
        .integer()
        .min(constants.paginateMinLimit)
        .max(constants.paginateMaxLimit)
        .default(constants.paginateMinLimit),
    status: joi.string().valid(...constants.queryStatuses),
    appId: joi.string().regex(constants.identifierPattern),
});

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

const create = async (context, attributes): Promise<ExternalQuery> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const newQuery = new QueryTemplateModel({
        ...value,
        status: "enabled",
    });
    await newQuery.save();

    return toExternal(newQuery);
};

const listByAppId = async (context, parameters): Promise<QueryPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { page, limit, appId } = value;
    const filters = {
        app: appId,
        status: {
            $ne: "deleted",
        },
    };

    const queries = await (QueryTemplateModel as any).paginate(filters, {
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
        totalRecords: queries.totalDocs,
        totalPages: queries.totalPages,
        previousPage: queries.prevPage ? queries.prevPage - 1 : -1,
        nextPage: queries.nextPage ? queries.nextPage - 1 : -1,
        hasPreviousPage: queries.hasPrevPage,
        hasNextPage: queries.hasNextPage,
        records: queries.docs.map(toExternal),
    };
};

const listByIds = async (
    context,
    queryTemplateIds: string[]
): Promise<ExternalQuery[]> => {
    const unorderedQueries = await QueryTemplateModel.find({
        _id: { $in: queryTemplateIds },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const query of unorderedQueries) {
        object[query._id] = query;
    }
    // eslint-disable-next-line security/detect-object-injection
    return queryTemplateIds.map((key) => toExternal(object[key]));
};

const getById = async (
    context,
    queryTemplateId: string
): Promise<ExternalQuery> => {
    if (!constants.identifierPattern.test(queryTemplateId)) {
        throw new BadRequestError("The specified query identifier is invalid.");
    }

    // TODO: Update filters
    const filters = {
        _id: queryTemplateId,
        status: { $ne: "deleted" },
    };
    const query = await QueryTemplateModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the query. */
    if (!query) {
        throw new NotFoundError(
            "Cannot find a query with the specified identifier."
        );
    }

    return toExternal(query);
};

const update = async (
    context,
    queryTemplateId: string,
    attributes
): Promise<ExternalQuery> => {
    if (!constants.identifierPattern.test(queryTemplateId)) {
        throw new BadRequestError("The specified query identifier is invalid.");
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const query = await QueryTemplateModel.findOneAndUpdate(
        {
            _id: queryTemplateId,
            status: { $ne: "deleted" },
        },
        value,
        {
            new: true,
            lean: true,
        }
    ).exec();

    if (!query) {
        throw new NotFoundError(
            "A query with the specified identifier does not exist."
        );
    }

    return toExternal(query);
};

const remove = async (
    context,
    queryTemplateId: string
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(queryTemplateId)) {
        throw new BadRequestError("The specified query identifier is invalid.");
    }

    // TODO: Update filters
    const query = await QueryTemplateModel.findOneAndUpdate(
        {
            _id: queryTemplateId,
            status: { $ne: "deleted" },
        },
        {
            status: "deleted",
        },
        {
            new: true,
            lean: true,
        }
    );

    if (!query) {
        throw new NotFoundError(
            "A query with the specified identifier does not exist."
        );
    }

    return { success: true };
};

const removeAllStatic = async (
    context,
    appId: string
): Promise<{ success: boolean }> => {
    // TODO: Update filters
    const query = await QueryTemplateModel.updateMany(
        {
            app: appId,
            lifecycle: "static",
            status: { $ne: "deleted" },
        },
        {
            status: "deleted",
        },
        {
            new: true,
            lean: true,
        }
    );

    if (!query) {
        throw new NotFoundError("Cannot find any static queries.");
    }

    return { success: true };
};

export {
    create,
    listByIds,
    listByAppId,
    getById,
    update,
    remove,
    removeAllStatic,
};

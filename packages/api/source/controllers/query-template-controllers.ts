import {
    AppModel,
    ExternalQuery,
    InternalServerError,
    Query,
    QueryPage,
    ResourceModel,
} from "@hypertool/common";
import {
    BadRequestError,
    NotFoundError,
    QueryTemplateModel,
    constants,
    runAsTransaction,
} from "@hypertool/common";

import joi from "joi";
import mongoose from "mongoose";

import {
    checkAccessToApps,
    checkAccessToQueryTemplates,
    checkAccessToResources,
} from "../utils";

const createSchema = joi.object({
    name: joi.string().regex(constants.namePattern).required(),
    description: joi.string().max(512).allow("").default(""),
    resource: joi.string().regex(constants.identifierPattern).required(),
    app: joi.string().regex(constants.identifierPattern).required(),
    content: joi.string().max(10240).required(),
});

const updateSchema = joi.object({
    description: joi.string().max(512).allow(""),
    content: joi.string().max(10240),
});

const filterSchema = joi.object({
    app: joi.string().regex(constants.identifierPattern).required(),
    page: joi.number().integer().default(0),
    limit: joi
        .number()
        .integer()
        .min(constants.paginateMinLimit)
        .max(constants.paginateMaxLimit)
        .default(constants.paginateMinLimit),
});

const toExternal = (query: Query): ExternalQuery => {
    const {
        _id,
        name,
        description,
        resource,
        app,
        content,
        status,
        createdAt,
        updatedAt,
    } = query;

    return {
        id: _id.toString(),
        name,
        description,
        resource:
            typeof resource === "string" ? resource : resource._id.toString(),
        app: typeof app === "string" ? app : app._id.toString(),
        content,
        status,
        createdAt,
        updatedAt,
    };
};

/*
 * The query template is associated with the app to which the resource belongs
 * to.
 */
const create = async (context, attributes): Promise<ExternalQuery> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const newQuery = await runAsTransaction(async () => {
        const queryTemplateId = new mongoose.Types.ObjectId();

        /* Ensure that the specified resource exists. */
        const resource = await ResourceModel.findOne(
            {
                _id: value.resource,
                status: { $ne: "deleted" },
            },
            null,
            { lean: true },
        ).exec();
        if (!resource) {
            throw new NotFoundError(
                `Cannot find a resource with the identifier "${value.resource}".`,
            );
        }

        checkAccessToResources(context.user, [resource]);

        /* Establish a bidirectional relationship with the app. */
        const app = await AppModel.findOneAndUpdate(
            { _id: resource.app, status: { $ne: "deleted" } },
            { $push: { queries: queryTemplateId } },
            { new: true, lean: true },
        ).exec();
        if (!app) {
            throw new InternalServerError(
                `Cannot find the app with identifier "${value.app}, referenced by resource "${value.resource}".`,
            );
        }

        /*
         * At this point, the app has been modified, regardless of the
         * user being authorized or not. When we check for access below,
         * we rely on the transaction failing to undo the changes.
         */
        checkAccessToApps(context.user, [app]);

        /* Ensure that the name of the query template is unique within the app. */
        const query = await QueryTemplateModel.findOne(
            {
                name: value.name,
                app: value.app,
                status: { $ne: "deleted" },
            },
            null,
            { lean: true },
        ).exec();
        if (query) {
            throw new BadRequestError(
                `Query with name ${value.name} already exists.`,
            );
        }

        const newQuery = new QueryTemplateModel({
            ...value,
            _id: queryTemplateId,
            app: resource.app,
            creator: context.user._id,
            status: "enabled",
        });
        await newQuery.save();

        return newQuery;
    });

    return toExternal(newQuery);
};

const listByAppId = async (context, parameters): Promise<QueryPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { page, limit } = value;
    const app = await AppModel.findOne(
        {
            _id: value.app,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();
    if (!app) {
        throw new NotFoundError(
            `Cannot find an app with the specified identifier "${value.app}".`,
        );
    }

    checkAccessToApps(context.user, [app]);

    const queries = await (QueryTemplateModel as any).paginate(
        {
            app: value.app,
            status: {
                $ne: "deleted",
            },
        },
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
    queryTemplateIds: string[],
): Promise<ExternalQuery[]> => {
    const queryTemplates = await QueryTemplateModel.find({
        _id: { $in: queryTemplateIds },
        status: { $ne: "deleted" },
    }).exec();
    if (queryTemplates.length !== queryTemplates.length) {
        throw new NotFoundError(
            `Could not find query templates for every specified ID. Requested ${queryTemplateIds.length} query templates, but found ${queryTemplates.length} query templates.`,
        );
    }

    checkAccessToQueryTemplates(context.user, queryTemplates);

    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const query of queryTemplates) {
        object[query._id.toString()] = query;
    }
    return queryTemplateIds.map((key) => toExternal(object[key]));
};

const getById = async (
    context,
    queryTemplateId: string,
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
            "Cannot find a query with the specified identifier.",
        );
    }

    return toExternal(query);
};

const getByName = async (context, name: string): Promise<ExternalQuery> => {
    if (!constants.namePattern.test(name)) {
        throw new BadRequestError("The specified query name is invalid.");
    }

    // TODO: Update filters
    const filters = {
        name,
        status: { $ne: "deleted" },
    };
    const query = await QueryTemplateModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the query. */
    if (!query) {
        throw new NotFoundError("Cannot find a query with the specified name.");
    }

    return toExternal(query);
};

const update = async (
    context,
    queryTemplateId: string,
    attributes,
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
        },
    ).exec();

    if (!query) {
        throw new NotFoundError(
            "A query with the specified identifier does not exist.",
        );
    }

    return toExternal(query);
};

const remove = async (
    context,
    queryTemplateId: string,
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(queryTemplateId)) {
        throw new BadRequestError("The specified query identifier is invalid.");
    }

    // TODO: Update filters
    const query = await QueryTemplateModel.findOneAndUpdate(
        {
            _id: queryTemplateId,
            status: { $ne: "deleted" },
            creator: context.user._id,
        },
        {
            status: "deleted",
        },
        {
            new: true,
            lean: true,
        },
    );

    if (!query) {
        throw new NotFoundError(
            "A query with the specified identifier does not exist.",
        );
    }

    return { success: true };
};

export {
    create,
    listByIds,
    listByAppId as listByAppId,
    getById,
    getByName,
    update,
    remove,
};

import type {
    IBigQueryConfiguration,
    IExternalResource,
    IResource,
} from "@hypertool/common";
import {
    AppModel,
    BadRequestError,
    NotFoundError,
    ResourceModel,
    constants,
    runAsTransaction,
} from "@hypertool/common";

import joi from "joi";
import mongoose, { ClientSession } from "mongoose";

import { checkAccessToApps, checkAccessToResources } from "../utils";
import { accessApp } from "../utils";

// TODO: Add limits to database configurations!
const createSchema = joi.object({
    name: joi.string().regex(constants.namePattern).max(256).required(),
    description: joi.string().max(512).allow("").default(""),
    type: joi
        .string()
        .valid(...constants.resourceTypes)
        .required(),
    app: joi.string().regex(constants.identifierPattern).required(),
    mysql: joi.object({
        host: joi.string().required(),
        port: joi.number().integer().required(),
        databaseName: joi.string().required(),
        databaseUserName: joi.string().required(),
        databasePassword: joi.string().required(),
        connectUsingSSL: joi.boolean().default(false),
    }),
    postgres: joi.object({
        host: joi.string().required(),
        port: joi.number().integer().required(),
        databaseName: joi.string().required(),
        databaseUserName: joi.string().required(),
        databasePassword: joi.string().required(),
        connectUsingSSL: joi.boolean().default(false),
    }),
    mongodb: joi.object({
        host: joi.string().required(),
        port: joi.number().integer().required(),
        databaseName: joi.string().required(),
        databaseUserName: joi.string().required(),
        databasePassword: joi.string().required(),
        connectUsingSSL: joi.boolean().default(false),
    }),
    bigquery: joi.object({
        key: joi.any(),
    }),
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

const updateSchema = joi.object({
    description: joi.string().max(512).allow(""),
    mysql: joi.object({
        host: joi.string().required(),
        port: joi.number().integer().required(),
        databaseName: joi.string().required(),
        databaseUserName: joi.string().required(),
        databasePassword: joi.string().required(),
        connectUsingSSL: joi.boolean().default(false),
    }),
    postgres: joi.object({
        host: joi.string().required(),
        port: joi.number().integer().required(),
        databaseName: joi.string().required(),
        databaseUserName: joi.string().required(),
        databasePassword: joi.string().required(),
        connectUsingSSL: joi.boolean().default(false),
    }),
    mongodb: joi.object({
        host: joi.string().required(),
        port: joi.number().integer().required(),
        databaseName: joi.string().required(),
        databaseUserName: joi.string().required(),
        databasePassword: joi.string().required(),
        connectUsingSSL: joi.boolean().default(false),
    }),
    bigquery: joi.object({
        key: joi.any(),
    }),
});

const toExternal = (resource: IResource): IExternalResource => {
    const { _id, name, description, app, type, status, createdAt, updatedAt } =
        resource;
    let sanitizedConfiguration = null;
    switch (type) {
        case "mysql":
        case "postgres":
        case "mongodb": {
            const {
                host,
                port,
                databaseName,
                databaseUserName,
                databasePassword,
                connectUsingSSL,
            } = resource[type];
            sanitizedConfiguration = {
                host,
                port,
                databaseName,
                databaseUserName,
                databasePassword,
                connectUsingSSL,
            };
            break;
        }

        case "bigquery": {
            sanitizedConfiguration = resource[type];
            break;
        }

        default: {
            throw new Error(`Unknown resource type "${type}"`);
        }
    }

    const result = {
        id: _id.toString(),
        name,
        description,
        app,
        type,
        status,
        createdAt,
        updatedAt,
    };
    result[type] = sanitizedConfiguration;
    return result as IExternalResource;
};

const create = async (context, attributes): Promise<IExternalResource> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const newResource = await runAsTransaction(
        async (session: ClientSession) => {
            const resourceId = new mongoose.Types.ObjectId();

            /* Establish a bidirectional relationship betweenresource and app. */
            const app = await AppModel.findOneAndUpdate(
                { _id: value.app, status: { $ne: "deleted" } },
                { $push: { resources: resourceId } },
                { new: true, lean: true, session },
            ).exec();
            if (!app) {
                throw new NotFoundError(
                    `Cannot find an app with the specified identifier "${value.app}".`,
                );
            }

            checkAccessToApps(context.user, [app]);

            /* Check if name already exists in any resource of the given app. */
            const existingResource = await ResourceModel.findOne(
                {
                    app: value.app,
                    name: value.name,
                    status: { $ne: "deleted" },
                },
                null,
                { lean: true },
            ).exec();
            if (existingResource) {
                throw new BadRequestError(
                    `Resource with name "${value.name}" already exists`,
                );
            }

            const newResource = new ResourceModel({
                ...value,
                _id: resourceId,
                status: "enabled",
                creator: context.user._id,
            });
            await newResource.save({ session });

            return newResource;
        },
    );

    return toExternal(newResource);
};

const list = async (context, parameters): Promise<IBigQueryConfiguration> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    await accessApp(context.user, value.app);

    const resources = await (ResourceModel as any).paginate(
        {
            app: value.app,
            status: {
                $ne: "deleted",
            },
        },
        {
            limit: value.limit,
            page: value.page + 1,
            lean: true,
            leanWithId: true,
            pagination: true,
            sort: {
                updatedAt: -1,
            },
        },
    );

    return {
        totalRecords: resources.totalDocs,
        totalPages: resources.totalPages,
        previousPage: resources.prevPage ? resources.prevPage - 1 : -1,
        nextPage: resources.nextPage ? resources.nextPage - 1 : -1,
        hasPreviousPage: resources.hasPrevPage,
        hasNextPage: resources.hasNextPage,
        records: resources.docs.map(toExternal),
    };
};

const listByIds = async (
    context,
    resourceIds: string[],
): Promise<IExternalResource[]> => {
    const resources = await ResourceModel.find({
        _id: { $in: resourceIds },
        status: { $ne: "deleted" },
    }).exec();
    if (resources.length !== resourceIds.length) {
        throw new NotFoundError(
            `Could not find resources for every specified ID. Requested ${resourceIds.length} resources, but found ${resources.length} resources.`,
        );
    }

    checkAccessToResources(context.user, resources);

    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const resource of resources) {
        object[resource._id.toString()] = resource;
    }
    return resourceIds.map((key) => toExternal(object[key]));
};

const getById = async (
    context,
    resourceId: string,
): Promise<IExternalResource> => {
    if (!constants.identifierPattern.test(resourceId)) {
        throw new BadRequestError(
            `The specified resource identifier "${resourceId}" is invalid.`,
        );
    }

    const resource = await ResourceModel.findOne(
        {
            _id: resourceId,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();

    /* We return a 404 error, if we did not find the resource. */
    if (!resource) {
        throw new NotFoundError(
            `Cannot find a resource with the specified identifier "${resourceId}".`,
        );
    }

    checkAccessToResources(context.user, [resource]);

    return toExternal(resource);
};

const getByName = async (context, name: string): Promise<IExternalResource> => {
    if (!constants.namePattern.test(name)) {
        throw new BadRequestError(
            `The specified resource name "${name}" is invalid.`,
        );
    }

    const resource = await ResourceModel.findOne(
        {
            name,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();

    /* We return a 404 error, if we did not find the resource. */
    if (!resource) {
        throw new NotFoundError(
            `Cannot find a resource with the specified name "${name}".`,
        );
    }

    checkAccessToResources(context.user, [resource]);

    return toExternal(resource);
};

const update = async (
    context,
    resourceId: string,
    attributes,
): Promise<IExternalResource> => {
    if (!constants.identifierPattern.test(resourceId)) {
        throw new BadRequestError(
            `The specified resource identifier "${resourceId}" is invalid.`,
        );
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const resource = await runAsTransaction(async (session: ClientSession) => {
        const resource = await ResourceModel.findOneAndUpdate(
            {
                _id: resourceId,
                status: { $ne: "deleted" },
            },
            value,
            {
                new: true,
                lean: true,
                session,
            },
        ).exec();
        if (!resource) {
            throw new NotFoundError(
                `A resource with the specified identifier "${resourceId}" does not exist.`,
            );
        }

        /*
         * At this point, the resource has been modified, regardless of the
         * user being authorized or not. When we check for access below, we rely
         * on the transaction failing to undo the changes.
         */
        checkAccessToResources(context.user, [resource]);

        return resource;
    });

    return toExternal(resource);
};

/**
 * Before a resource is deleted, all the apps using it should stop using it.
 * TODO: If there are any apps using the app, the request should fail with appropriate
 * explanation.
 */
const remove = async (
    context,
    resourceId: string,
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(resourceId)) {
        throw new BadRequestError(
            `The specified resource identifier "${resourceId}" is invalid.`,
        );
    }

    runAsTransaction(async (session: ClientSession) => {
        const resource = await ResourceModel.findOneAndUpdate(
            {
                _id: resourceId,
                status: { $ne: "deleted" },
            },
            {
                status: "deleted",
            },
            {
                new: true,
                lean: true,
                session,
            },
        );
        if (!resource) {
            throw new NotFoundError(
                `A resource with the specified identifier "${resourceId}" does not exist.`,
            );
        }

        /*
         * At this point, the resource has been modified, regardless of the
         * user being authorized or not. When we check for access below, we rely
         * on the transaction failing to undo the changes.
         */
        checkAccessToResources(context.user, [resource]);

        return resource;
    });

    return { success: true };
};

export { create, list, listByIds, getById, getByName, update, remove };

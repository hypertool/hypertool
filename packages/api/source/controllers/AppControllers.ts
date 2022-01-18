import type { Document } from "mongoose";

import joi from "joi";

import type { App, ExternalApp, AppPage, User } from "../types";

import {
    constants,
    BadRequestError,
    NotFoundError,
    extractIds,
} from "../utils";
import { AppModel } from "../models";

const createSchema = joi.object({
    name: joi.string().max(128).required(),
    title: joi.string().max(256).required(),
    slug: joi.string().max(128).required(),
    description: joi.string().max(512).allow("").default(""),
    groups: joi
        .array()
        .items(joi.string().regex(constants.identifierPattern))
        .default([]),
});

const updateSchema = joi.object({
    name: joi.string().max(128),
    title: joi.string().max(256),
    slug: joi.string().max(128),
    description: joi.string().max(512).allow(""),
    groups: joi.array().items(joi.string().regex(constants.identifierPattern)),
    authServices: joi.object({
        googleAuth: joi.object({
            enabled: joi.boolean().required(),
            clientId: joi.string().required(),
            secret: joi.string().required(),
        }),
    }),
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

const toExternal = (app: App & Document<App>): ExternalApp => {
    const {
        id,
        _id,
        name,
        title,
        slug,
        description,
        groups,
        resources,
        creator,
        status,
        createdAt,
        updatedAt,
    } = app;

    const result = {
        id: id || _id.toString(),
        name,
        title,
        slug,
        description,
        groups: extractIds(groups),
        resources: extractIds(resources),
        // TODO: Remove the hard coded string.
        creator:
            typeof creator === "string"
                ? creator
                : "<todo>" || (creator as User).id,
        status,
        createdAt,
        updatedAt,
    };
    console.log(result);
    return result;
};

const create = async (context, attributes): Promise<ExternalApp> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Check if value.members and value.resources are correct.
    const newApp = new AppModel({
        ...value,
        status: "private",
    });
    await newApp.save();

    return toExternal(newApp);
};

const list = async (context, parameters): Promise<AppPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Update filters
    const filters = {
        status: {
            $ne: "deleted",
        },
    };
    const { page, limit } = value;

    const apps = await (AppModel as any).paginate(filters, {
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
        totalRecords: apps.totalDocs,
        totalPages: apps.totalPages,
        previousPage: apps.prevPage ? apps.prevPage - 1 : -1,
        nextPage: apps.nextPage ? apps.nextPage - 1 : -1,
        hasPreviousPage: apps.hasPrevPage,
        hasNextPage: apps.hasNextPage,
        records: apps.docs.map(toExternal),
    };
};

const listByIds = async (context, appIds: string[]): Promise<ExternalApp[]> => {
    const unorderedApps = await AppModel.find({
        _id: { $in: appIds },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const app of unorderedApps) {
        object[app._id] = app;
    }
    // eslint-disable-next-line security/detect-object-injection
    return appIds.map((key) => toExternal(object[key]));
};

const getById = async (context, appId: string): Promise<ExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError("The specified app identifier is invalid.");
    }

    // TODO: Update filters
    const filters = {
        _id: appId,
        status: { $ne: "deleted" },
    };
    const app = await AppModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the app. */
    if (!app) {
        throw new NotFoundError(
            "Cannot find an app with the specified identifier.",
        );
    }

    return toExternal(app);
};

const getByName = async (context, name: string): Promise<ExternalApp> => {
    if (!constants.namePattern.test(name)) {
        throw new BadRequestError("The specified app name is invalid.");
    }

    // TODO: Update filters
    const filters = {
        name,
        status: { $ne: "deleted" },
    };
    const app = await AppModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the app. */
    if (!app) {
        throw new NotFoundError("Cannot find an app with the specified name.");
    }

    return toExternal(app);
};

const update = async (
    context,
    appId: string,
    attributes,
): Promise<ExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError("The specified app identifier is invalid.");
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Update filters
    // TODO: Check if value.members and value.resources are correct.
    const app = await AppModel.findOneAndUpdate(
        {
            _id: appId,
            status: { $ne: "deleted" },
        },
        value,
        {
            new: true,
            lean: true,
        },
    ).exec();

    if (!app) {
        throw new NotFoundError(
            "An app with the specified identifier does not exist.",
        );
    }

    return toExternal(app);
};

const publish = async (context, appId: string): Promise<ExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError("The specified app identifier is invalid.");
    }

    // TODO: Update filters
    const app = await AppModel.findOneAndUpdate(
        {
            _id: appId,
            status: { $ne: "deleted" },
        },
        {
            status: "public",
        },
        {
            new: true,
            lean: true,
        },
    );

    if (!app) {
        throw new NotFoundError(
            "An app with the specified identifier does not exist.",
        );
    }

    return toExternal(app);
};

const unpublish = async (context, appId: string): Promise<ExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError("The specified app identifier is invalid.");
    }

    // TODO: Update filters
    const app = await AppModel.findOneAndUpdate(
        {
            _id: appId,
            status: { $ne: "deleted" },
        },
        {
            status: "private",
        },
        {
            new: true,
            lean: true,
        },
    );

    if (!app) {
        throw new NotFoundError(
            "An app with the specified identifier does not exist.",
        );
    }

    return toExternal(app);
};

const remove = async (
    context,
    appId: string,
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError("The specified app identifier is invalid.");
    }

    // TODO: Update filters
    const app = await AppModel.findOneAndUpdate(
        {
            _id: appId,
            status: { $ne: "deleted" },
        },
        {
            status: "deleted",
        },
        {
            new: true,
            lean: true,
        },
    );

    if (!app) {
        throw new NotFoundError(
            "An app with the specified identifier does not exist.",
        );
    }

    return { success: true };
};

export {
    create,
    list,
    listByIds,
    getById,
    getByName,
    update,
    publish,
    unpublish,
    remove,
};

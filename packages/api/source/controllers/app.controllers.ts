import type { IApp, IExternalApp, IUser, TAppPage } from "@hypertool/common";
import {
    AppModel,
    BadRequestError,
    NotFoundError,
    constants,
    extractIds,
} from "@hypertool/common";

import joi from "joi";

const createSchema = joi.object({
    name: joi.string().max(128).required(),
    title: joi.string().max(256).required(),
    slug: joi.string().max(128).required(),
    description: joi.string().max(512).allow("").default(""),
    organization: joi.string().regex(constants.identifierPattern),
    resources: joi
        .array()
        .items(joi.string().regex(constants.identifierPattern)),
});

const updateSchema = joi.object({
    name: joi.string().max(128),
    title: joi.string().max(256),
    slug: joi.string().max(128),
    description: joi.string().max(512).allow(""),
    authServices: joi.object({
        googleAuth: joi.object({
            enabled: joi.boolean().required(),
            clientId: joi.string().required(),
            secret: joi.string().required(),
        }),
    }),
    resources: joi
        .array()
        .items(joi.string().regex(constants.identifierPattern)),
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

const toExternal = (app: IApp): IExternalApp => {
    const {
        _id,
        name,
        title,
        slug,
        description,
        organization,
        resources,
        screens,
        creator,
        status,
        createdAt,
        updatedAt,
        deployments,
    } = app;

    const result = {
        id: _id.toString(),
        name,
        title,
        slug,
        description,
        organization,
        screens: screens.map((screen) => screen.toString()),
        /*
         * resources: extractIds(resources),
         * creator:
         *     typeof creator === "string"
         *         ? creator
         *         : (creator as IUser)._id.toString(),
         */
        status,
        createdAt,
        updatedAt,
        deployments,
    };

    return result as any;
};

const create = async (context, attributes): Promise<IExternalApp> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    // Check if the app name is already taken.
    const existingApp = await AppModel.findOne({
        name: value.name,
    }).exec();
    if (existingApp) {
        throw new BadRequestError(
            `App with name ${value.name} already exists.`,
        );
    }

    // TODO: Check if value.members and value.resources are correct.
    const newApp = new AppModel({
        ...value,
        status: "private",
    });
    await newApp.save();

    return toExternal(newApp);
};

const list = async (context, parameters): Promise<TAppPage> => {
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

const listByIds = async (
    context,
    appIds: string[],
): Promise<IExternalApp[]> => {
    const unorderedApps = await AppModel.find({
        _id: { $in: appIds },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const app of unorderedApps) {
        object[app._id.toString()] = app;
    }
    return appIds.map((key) => toExternal(object[key]));
};

const getById = async (context, appId: string): Promise<IExternalApp> => {
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

const getByName = async (context, name: string): Promise<IExternalApp> => {
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
): Promise<IExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError("The specified app identifier is invalid.");
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

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

const publish = async (context, appId: string): Promise<IExternalApp> => {
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

const unpublish = async (context, appId: string): Promise<IExternalApp> => {
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

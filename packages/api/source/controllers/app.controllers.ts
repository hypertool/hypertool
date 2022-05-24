import {
    ControllerModel,
    IApp,
    IController,
    IExternalApp,
    IQueryTemplate,
    IResource,
    IScreen,
    InternalServerError,
    OrganizationModel,
    QueryTemplateModel,
    ResourceModel,
    ScreenModel,
    TAppPage,
    UserModel,
    runAsTransaction,
} from "@hypertool/common";
import {
    AppModel,
    BadRequestError,
    NotFoundError,
    constants,
} from "@hypertool/common";

import { createTwoFilesPatch } from "diff";
import joi from "joi";
import { ClientSession, Types } from "mongoose";

import {
    checkAccessToApps,
    hashPassword,
    patchAll,
    sendVerificationEmail,
    validateAttributes,
} from "../utils";

const createSchema = joi.object({
    name: joi.string().regex(constants.namePattern).required(),
    title: joi.string().max(256).required(),
    description: joi.string().max(512).allow("").default(""),
    organization: joi.string().regex(constants.identifierPattern),
});

const duplicateSchema = joi.object({
    sourceApp: joi.string().regex(constants.identifierPattern).required(),
    name: joi.string().regex(constants.namePattern).required(),
    title: joi.string().max(256).required(),
    description: joi.string().max(512).allow("").default(""),
    organization: joi.string().regex(constants.identifierPattern),
});

const updateSchema = joi.object({
    title: joi.string().max(256),
    description: joi.string().max(512).allow(""),
});

const filterSchema = joi.object({
    // organization: joi.string().regex(constants.identifierPattern).required(),
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
        description,
        root,
        resources,
        queryTemplates,
        deployments,
        screens,
        controllers,
        creator,
        organization,
        status,
        createdAt,
        updatedAt,
    } = app;

    const result = {
        id: _id.toString(),
        name,
        title,
        description,
        root,
        resources: resources.map((resource) => resource.toString()),
        queryTemplates: queryTemplates.map((queryTemplate) =>
            queryTemplate.toString(),
        ),
        deployments: deployments.map((deployment) => deployment.toString()),
        screens: screens.map((screen) => screen.toString()),
        controllers: controllers.map((controller) => controller.toString()),
        creator: creator.toString(),
        organization: organization?.toString() ?? null,
        status,
        createdAt,
        updatedAt,
    };

    return result;
};

// TODO: Check for permissions.

const checkDuplicate = async (name: string) => {
    const existingApp = await AppModel.findOne({
        name,
        status: { $ne: "deleted" },
    }).exec();
    if (existingApp) {
        throw new BadRequestError(`App with name "${name}" already exists.`);
    }
};

const updateOwnershipToOrganization = async (
    session: ClientSession,
    organizationId: string,
    appId: Types.ObjectId,
) => {
    const organization = await OrganizationModel.findOneAndUpdate(
        {
            _id: organizationId,
            status: { $ne: "deleted" },
        },
        {
            $push: {
                apps: appId,
            },
        },
        { new: true, lean: true, session },
    ).exec();
    if (!organization) {
        throw new NotFoundError(
            `Cannot find an organization with the specified identifier "${organizationId}".`,
        );
    }
    // TODO: Check if the user belongs to the organization.
};

const updateOwnershipToUser = async (
    session: ClientSession,
    appId: Types.ObjectId,
    userId: Types.ObjectId,
) => {
    await UserModel.findOneAndUpdate(
        {
            _id: userId,
        },
        {
            $push: {
                apps: appId,
            },
        },
        {
            new: true,
            lean: true,
            session,
        },
    ).exec();
};

/**
 * Make sure that this function is called within the context of a transaction.
 */
const createBaseApp = async (
    session: ClientSession,
    userId: Types.ObjectId,
    attributes: any,
) => {
    /* Check if the app name is already taken. */
    await checkDuplicate(attributes.name);

    const newAppId = new Types.ObjectId();

    if (attributes.organization) {
        /*
         * If the app belongs to an organization, establish a bidirectional
         * relationship.
         */
        updateOwnershipToOrganization(
            session,
            attributes.organization,
            newAppId,
        );
    } else {
        /*
         * If the app does not belong to any organization, the ownership of
         * the app is given to the user.
         */
        await updateOwnershipToUser(session, newAppId, userId);
    }

    /* Create the new app. */
    const newApp = new AppModel({
        ...attributes,
        _id: newAppId,
        creator: userId,
        status: "private",
    });
    await newApp.save({ session });

    return newApp;
};

const defaultResourceConfigurations: Record<string, any> = {
    mysql: {
        host: "<redacted>",
        port: 3306,
        databaseName: "<redacted>",
        databaseUserName: "<redacted>",
        databasePassword: "<redacted>",
        connectUsingSSL: false,
    },
    postgres: {
        host: "<redacted>",
        port: 5432,
        databaseName: "<redacted>",
        databaseUserName: "<redacted>",
        databasePassword: "<redacted>",
        connectUsingSSL: false,
    },
};

/**
 * Make sure that this function is called within the context of a transaction.
 */
const duplicateEntities = async (
    session: ClientSession,
    sourceApp: IApp,
    appId: string,
    userId: Types.ObjectId,
): Promise<IApp> => {
    const newResources = [];
    const resourceMappings: Record<string, Types.ObjectId> = {};
    for (const resource of sourceApp.resources) {
        const resource0 = resource as IResource;
        /*
         * NOTE: Do not copy configuration data, even within the same organization,
         * given their sensitive information.
         */
        const { name, description, type, status } = resource0;
        const newResourceId = new Types.ObjectId();
        newResources.push({
            _id: newResourceId,
            name,
            description,
            type,
            status,
            creator: userId,
            app: appId,
            [type]: defaultResourceConfigurations[type],
        });
        resourceMappings[resource0._id.toString()] = newResourceId;
    }

    const newQueryTemplates = [];
    for (const queryTemplate of sourceApp.queryTemplates) {
        const queryTemplate0 = queryTemplate as IQueryTemplate;
        const { name, description, resource, content, status } = queryTemplate0;
        newQueryTemplates.push({
            _id: new Types.ObjectId(),
            name,
            description,
            resource: resourceMappings[resource.toString()],
            app: appId,
            content,
            creator: userId,
            status,
        });
    }

    const controllerMappings: Record<string, Types.ObjectId> = {};
    const newControllers = [];
    for (const controller of sourceApp.controllers) {
        const controller0 = controller as IController;
        const { name, description, language, patches, status } = controller0;

        const newControllerId = new Types.ObjectId();
        controllerMappings[controller0._id.toString()] = newControllerId;

        newControllers.push({
            _id: newControllerId,
            name,
            description,
            language,
            creator: userId,
            patches:
                patches.length === 0
                    ? []
                    : [
                          {
                              author: userId,
                              content: createTwoFilesPatch(
                                  `a/${controller0.name}`,
                                  `b/${controller0.name}`,
                                  "",
                                  patchAll(patches),
                                  "",
                                  "",
                              ),
                          },
                      ],
            app: appId,
            status,
        });
    }

    const newScreens = [];
    for (const screen of sourceApp.screens) {
        const screen0 = screen as IScreen;
        const { name, title, description, slug, content, controller, status } =
            screen0;
        newScreens.push({
            _id: new Types.ObjectId(),
            name,
            title,
            description,
            slug,
            content,
            controller:
                controller && controllerMappings[controller?.toString()],
            creator: userId,
            app: appId,
            status,
        });
    }

    const [_resources, _queryTemplates, _controllers, _screens, app] =
        await Promise.all([
            ResourceModel.insertMany(newResources, { session }),
            QueryTemplateModel.insertMany(newQueryTemplates, { session }),
            ControllerModel.insertMany(newControllers, { session }),
            ScreenModel.insertMany(newScreens, { session }),
            AppModel.findOneAndUpdate(
                {
                    _id: appId,
                    status: { $ne: "deleted" },
                },
                {
                    resources: newResources.map((resource) => resource._id),
                    queryTemplates: newQueryTemplates.map(
                        (queryTemplate) => queryTemplate._id,
                    ),
                    controllers: newControllers.map(
                        (controller) => controller._id,
                    ),
                    screens: newScreens.map((screen) => screen._id),
                },
                { new: true, lean: true, session },
            ).exec(),
        ]);

    if (!app) {
        throw new InternalServerError(
            `Could not find app with identifier "${appId}"`,
        );
    }

    return app;
};

export const create = async (context, attributes): Promise<IExternalApp> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const newApp = await runAsTransaction(
        async (session: ClientSession) =>
            await createBaseApp(session, context.user._id, value),
    );

    return toExternal(newApp);
};

const installSchema = joi.object({
    name: joi.string().regex(constants.namePattern).required(),
    title: joi.string().max(256).required(),
    description: joi.string().max(512).allow("").default(""),
    firstName: joi.string().min(1).max(256).required(),
    lastName: joi.string().min(1).max(256).required(),
    emailAddress: joi.string().max(256).required(),
    password: joi
        .string()
        .regex(constants.passwordRegex)
        .min(8)
        .max(128)
        .required(),
});

export const install = async (
    context: any,
    attributes: any,
): Promise<IExternalApp> => {
    const value = validateAttributes(installSchema, attributes);

    const [appCount, userCount] = await Promise.all([
        AppModel.count().exec(),
        UserModel.count().exec(),
    ]);
    if (appCount > 0) {
        throw new BadRequestError(
            "Cannot create root app when other apps exist in the database.",
        );
    }
    if (userCount > 0) {
        throw new BadRequestError(
            "Cannot create root user when other users exist in the database.",
        );
    }

    const newApp = await runAsTransaction(async (session: ClientSession) => {
        const newUserId = new Types.ObjectId();
        const newAppId = new Types.ObjectId();

        const { firstName, lastName, emailAddress, password } = value;
        const hashedPassword = await hashPassword(password);
        const newUser = new UserModel({
            _id: newUserId,
            firstName,
            lastName,
            description: "",
            password: hashedPassword,
            gender: undefined,
            countryCode: undefined,
            pictureURL: undefined,
            emailAddress,
            emailVerified: false,
            birthday: null,
            status: "activated",
            app: newAppId,
            organizations: [],
            apps: [],
        });

        const { name, title, description } = value;
        const newApp = new AppModel({
            _id: newAppId,
            name,
            title,
            description,
            root: true,
            resources: [],
            queryTemplates: [],
            deployments: [],
            screens: [],
            controllers: [],
            creator: newUserId,
            organization: undefined,
            status: "private",
            authServices: undefined,
        });

        await Promise.all([
            newUser.save({ session }),
            sendVerificationEmail(emailAddress),
            newApp.save({ session }),
        ]);

        return newApp;
    });

    return toExternal(newApp);
};

export const duplicate = async (context, attributes): Promise<IExternalApp> => {
    const { error, value } = duplicateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const newApp = await runAsTransaction(async (session: ClientSession) => {
        const sourceApp = await AppModel.findOne(
            {
                _id: value.sourceApp,
                status: { $ne: "deleted" },
            },
            null,
            { lean: true },
        )
            .populate({ path: "resources", model: "Resource" })
            .populate({ path: "screens", model: "Screen" })
            .populate({ path: "controllers", model: "Controller" })
            .populate({ path: "queryTemplates", model: "QueryTemplate" })
            .exec();
        if (!sourceApp) {
            throw new NotFoundError(
                `Cannot find an app with the specified identifier "${value.sourceApp}".`,
            );
        }
        checkAccessToApps(context.user, [sourceApp]);

        const newApp = await createBaseApp(session, context.user._id, value);
        return await duplicateEntities(
            session,
            sourceApp,
            newApp._id.toString(),
            context.user._id,
        );
    });

    return toExternal(newApp);
};

const list = async (context, parameters): Promise<TAppPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { page, limit } = value;
    const apps = await (AppModel as any).paginate(
        {
            _id: { $in: context.user.apps },
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
    const apps = await AppModel.find({
        _id: { $in: appIds },
        status: { $ne: "deleted" },
    }).exec();
    if (apps.length !== appIds.length) {
        throw new NotFoundError(
            `Could not find apps for every specified ID. Requested ${appIds.length} apps, but found ${apps.length} apps.`,
        );
    }

    checkAccessToApps(context.user, apps);

    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const app of apps) {
        object[app._id.toString()] = app;
    }

    return appIds.map((key) => toExternal(object[key]));
};

const getById = async (context, appId: string): Promise<IExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError(
            `The specified app identifier "${appId}" is invalid.`,
        );
    }

    const app = await AppModel.findOne({
        _id: appId,
        status: { $ne: "deleted" },
    }).exec();
    checkAccessToApps(context.user, [app]);

    /* We return a 404 error, if we did not find the app. */
    if (!app) {
        throw new NotFoundError(
            `Cannot find an app with the specified identifier "${appId}".`,
        );
    }

    return toExternal(app);
};

const getByName = async (context, name: string): Promise<IExternalApp> => {
    if (!constants.namePattern.test(name)) {
        throw new BadRequestError(
            `The specified app name "${name}" is invalid.`,
        );
    }

    const app = await AppModel.findOne({
        name,
        status: { $ne: "deleted" },
    }).exec();
    checkAccessToApps(context.user, [app]);

    /* We return a 404 error, if we did not find the app. */
    if (!app) {
        throw new NotFoundError(
            `Cannot find an app with the specified name "${name}".`,
        );
    }

    return toExternal(app);
};

export const getRootApp = async (context): Promise<IExternalApp> => {
    /*
     * NOTE: The root app cannot be deleted once created. Therefore, we do not
     * add the status filter.
     */
    const app = await AppModel.findOne({
        root: true,
    });
    /*
     * As of this writing, everyone has public read access to the root app.
     * Therefore, `checkAccessToApps` is not invoked.
     */

    /* We return a 404 error, if we did not find the app. */
    if (!app) {
        throw new NotFoundError(
            "The root app is missing, which most likely means Hypertool was not installed correctly. Have you invoked `installHypertool()` yet?",
        );
    }

    return toExternal(app);
};

const update = async (
    context,
    appId: string,
    attributes,
): Promise<IExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError(
            `The specified app identifier "${appId}" is invalid.`,
        );
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const app = await runAsTransaction(async (session: ClientSession) => {
        const app = await AppModel.findOneAndUpdate(
            {
                _id: appId,
                status: { $ne: "deleted" },
            },
            value,
            {
                new: true,
                lean: true,
                session,
            },
        ).exec();
        if (!app) {
            throw new NotFoundError(
                `An app with the specified identifier "${appId}" does not exist.`,
            );
        }

        /*
         * At this point, the app has been modified, regardless of the
         * user being authorized or not. When we check for access below,
         * we rely on the transaction failing to undo the changes.
         */
        checkAccessToApps(context.user, [app]);

        return app;
    });

    return toExternal(app);
};

const publish = async (context, appId: string): Promise<IExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError(
            `The specified app identifier "${appId}" is invalid.`,
        );
    }

    const app = await runAsTransaction(async (session: ClientSession) => {
        const app = await AppModel.findOneAndUpdate(
            {
                _id: appId,
                status: { $ne: "deleted" },
            },
            { status: "public" },
            {
                new: true,
                lean: true,
                session,
            },
        ).exec();
        if (!app) {
            throw new NotFoundError(
                `An app with the specified identifier "${appId}" does not exist.`,
            );
        }

        /*
         * At this point, the app has been modified, regardless of the
         * user being authorized or not. When we check for access below,
         * we rely on the transaction failing to undo the changes.
         */
        checkAccessToApps(context.user, [app]);

        return app;
    });

    return toExternal(app);
};

const unpublish = async (context, appId: string): Promise<IExternalApp> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError(
            `The specified app identifier "${appId}" is invalid.`,
        );
    }

    const app = await runAsTransaction(async (session: ClientSession) => {
        const app = await AppModel.findOneAndUpdate(
            {
                _id: appId,
                status: { $ne: "deleted" },
            },
            { status: "private" },
            {
                new: true,
                lean: true,
                session,
            },
        ).exec();
        if (!app) {
            throw new NotFoundError(
                `An app with the specified identifier "${appId}" does not exist.`,
            );
        }

        /*
         * At this point, the app has been modified, regardless of the
         * user being authorized or not. When we check for access below,
         * we rely on the transaction failing to undo the changes.
         */
        checkAccessToApps(context.user, [app]);

        return app;
    });

    return toExternal(app);
};

const remove = async (
    context,
    appId: string,
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(appId)) {
        throw new BadRequestError(
            `The specified app identifier "${appId}" is invalid.`,
        );
    }

    await runAsTransaction(async (session: ClientSession) => {
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
                session,
            },
        );
        if (!app) {
            throw new NotFoundError(
                `An app with the specified identifier "${appId}" does not exist.`,
            );
        }

        /*
         * At this point, the app has been modified, regardless of the
         * user being authorized or not. When we check for access below,
         * we rely on the transaction failing to undo the changes.
         */
        checkAccessToApps(context.user, [app]);
    });

    return { success: true };
};

export {
    list,
    listByIds,
    getById,
    getByName,
    update,
    publish,
    unpublish,
    remove,
};

import type { IExternalScreen, IScreen, TScreenPage } from "@hypertool/common";
import {
    AppModel,
    BadRequestError,
    ControllerModel,
    NotFoundError,
    ScreenModel,
    constants,
    runAsTransaction,
} from "@hypertool/common";

import joi from "joi";
import mongoose from "mongoose";

import { accessApp, checkAccessToApps, checkAccessToScreens } from "../utils";

const createSchema = joi.object({
    app: joi.string().regex(constants.identifierPattern).required(),
    name: joi.string().regex(constants.namePattern).required(),
    title: joi.string().min(1).max(256).required(),
    description: joi.string().max(512).allow("").default(""),
    slug: joi.string().regex(constants.slugPattern).required(),
    content: joi.string().allow("").default(""),
});

const updateSchema = joi.object({
    title: joi.string().min(1).max(256),
    description: joi.string().max(512).allow(""),
    slug: joi.string().regex(constants.slugPattern),
    content: joi.string().allow(""),
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

const toExternal = (screen: IScreen): IExternalScreen => {
    const {
        _id,
        app,
        name,
        title,
        description,
        slug,
        content,
        status,
        controller,
        createdAt,
        updatedAt,
    } = screen;
    return {
        id: _id.toString(),
        app: app.toString(),
        name,
        title,
        description,
        slug,
        content,
        status,
        controller:
            controller instanceof ControllerModel
                ? controller._id.toString()
                : controller.toString(),
        createdAt,
        updatedAt,
    };
};

export const create = async (context, attributes): Promise<IExternalScreen> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const newScreen = await runAsTransaction(async () => {
        const controllerId = new mongoose.Types.ObjectId();
        const newController = new ControllerModel({
            _id: controllerId,
            name: value.name,
            description: "",
            language: "javascript",
            creator: context.user._id,
            patches: [],
            status: "created",
        });

        const screenId = new mongoose.Types.ObjectId();
        const newScreen = new ScreenModel({
            ...value,
            _id: screenId,
            controller: controllerId,
            status: "created",
        });

        const [_newControllerResult, newScreenResult, app] = await Promise.all([
            newController.save(),
            newScreen.save(),
            AppModel.findOneAndUpdate(
                { _id: value.app, status: { $ne: "deleted" } },
                {
                    $push: {
                        screens: screenId,
                    },
                },
                {
                    new: true,
                    lean: true,
                },
            ).exec(),
        ]);

        if (!app) {
            throw new NotFoundError(
                `Cannot find app with the specified identifier "${value.app}".`,
            );
        }

        checkAccessToApps(context.user, [app]);

        return newScreenResult;
    });

    return toExternal(newScreen);
};

export const update = async (
    context,
    screenId: string,
    attributes,
): Promise<IExternalScreen> => {
    if (!constants.identifierPattern.test(screenId)) {
        throw new BadRequestError(
            `The specified screen identifier "${screenId}" is invalid.`,
        );
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const screen = await runAsTransaction(async () => {
        const screen = await ScreenModel.findOneAndUpdate(
            {
                _id: screenId,
                status: { $ne: "deleted" },
                creator: context.user._id,
            },
            value,
            { new: true, lean: true },
        ).exec();
        if (!screen) {
            throw new NotFoundError(
                `A screen with the specified identifier "${screenId}" does not exist.`,
            );
        }

        /*
         * At this point, the screen has been modified, regardless of the
         * user being authorized or not. When we check for access below, we rely
         * on the transaction failing to undo the changes.
         */
        checkAccessToScreens(context.user, [screen]);

        return screen;
    });

    return toExternal(screen);
};

export const list = async (context, parameters): Promise<TScreenPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    await accessApp(context.user, value.app);

    const screens = await (ScreenModel as any).paginate(
        {
            app: value.app,
            status: { $ne: "deleted" },
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
        totalRecords: screens.totalDocs,
        totalPages: screens.totalPages,
        previousPage: screens.prevPage ? screens.prevPage - 1 : -1,
        nextPage: screens.nextPage ? screens.nextPage - 1 : -1,
        hasPreviousPage: screens.hasPrevPage,
        hasNextPage: screens.hasNextPage,
        records: screens.docs.map(toExternal),
    };
};

export const listByIds = async (
    context,
    ids: string[],
): Promise<IExternalScreen[]> => {
    const screens = await ScreenModel.find(
        {
            _id: { $in: ids },
            status: { $ne: "deleted" },
            creator: context.user._id,
        },
        null,
        { lean: true },
    ).exec();
    if (screens.length !== ids.length) {
        throw new NotFoundError(
            `Could not find screens for every specified identifier. Requested ${ids.length} screens, but found ${screens.length} screens.`,
        );
    }

    checkAccessToScreens(context.user, screens);

    const object = {};
    for (const item of screens) {
        object[item._id.toString()] = item;
    }

    return ids.map((key) => toExternal(object[key]));
};

export const getById = async (
    context: any,
    screenId: string,
): Promise<IExternalScreen> => {
    if (!constants.identifierPattern.test(screenId)) {
        throw new BadRequestError(
            `The specified screen identifier "${screenId}" is invalid.`,
        );
    }

    const screen = await ScreenModel.findOne(
        {
            _id: screenId,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();
    /* We return a 404 error, if we did not find the entity. */
    if (!screen) {
        throw new NotFoundError(
            `Cannot find a screen with the specified identifier "${screenId}".`,
        );
    }

    checkAccessToScreens(context.user, [screen]);

    return toExternal(screen);
};

export const getByName = async (
    context: any,
    name: string,
): Promise<IExternalScreen> => {
    if (!constants.namePattern.test(name)) {
        throw new BadRequestError(`The specified name "${name}" is invalid.`);
    }

    const screen = await ScreenModel.findOne(
        {
            name,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();
    /* We return a 404 error, if we did not find the entity. */
    if (!screen) {
        throw new NotFoundError(
            `Cannot find a screen with the specified name "${name}".`,
        );
    }

    checkAccessToScreens(context.user, [screen]);

    return toExternal(screen);
};

export const remove = async (context: any, screenId: string) => {
    if (!constants.identifierPattern.test(screenId)) {
        throw new BadRequestError(
            "The specified screen identifier is invalid.",
        );
    }

    await runAsTransaction(async () => {
        const screen = await ScreenModel.findOneAndUpdate(
            {
                _id: screenId,
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
        if (!screen) {
            throw new NotFoundError(
                `Cannot find a screen with the specified identifier "${screenId}".`,
            );
        }
        /*
         * At this point, the screen has been modified, regardless of the
         * user being authorized or not. When we check for access below, we rely
         * on the transaction failing to undo the changes.
         */
        checkAccessToScreens(context.user, [screen]);
    });

    return { success: true };
};

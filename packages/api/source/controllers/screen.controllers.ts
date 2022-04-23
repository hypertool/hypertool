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

import { checkAccessToApps } from "../utils";

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
    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const updatedScreen = await ScreenModel.findOneAndUpdate(
        {
            _id: screenId,
            status: { $ne: "deleted" },
            creator: context.user._id,
        },
        value,
        { new: true, lean: true },
    ).exec();
    if (!updatedScreen) {
        throw new NotFoundError(
            "A screen with the specified identifier does not exist.",
        );
    }

    return toExternal(updatedScreen);
};

export const list = async (context, parameters): Promise<TScreenPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const { page, limit, appId } = value;
    const pages = await (ScreenModel as any).paginate(
        {
            app: appId,
            status: { $ne: "deleted" },
            creator: context.user._id,
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
        totalRecords: pages.totalDocs,
        totalPages: pages.totalPages,
        previousPage: pages.prevPage ? pages.prevPage - 1 : -1,
        nextPage: pages.nextPage ? pages.nextPage - 1 : -1,
        hasPreviousPage: pages.hasPrevPage,
        hasNextPage: pages.hasNextPage,
        records: pages.docs.map(toExternal),
    };
};

export const listByIds = async (
    context,
    ids: string[],
): Promise<IExternalScreen[]> => {
    const items = await ScreenModel.find({
        _id: { $in: ids },
        status: { $ne: "deleted" },
        creator: context.user._id,
    }).exec();
    if (items.length !== ids.length) {
        throw new NotFoundError(
            `Could not find items for every specified ID. Request ${ids.length} items, but found ${items.length} items.`,
        );
    }

    const object = {};
    for (const item of items) {
        object[item._id.toString()] = item;
    }

    return ids.map((key) => toExternal(object[key]));
};

export const getById = async (
    context: any,
    screenId: string,
): Promise<IExternalScreen> => {
    if (!constants.identifierPattern.test(screenId)) {
        throw new BadRequestError("The specified identifier is invalid.");
    }

    const document = await ScreenModel.findOne({
        _id: screenId,
        status: { $ne: "deleted" },
        creator: context.user._id,
    }).exec();
    /* We return a 404 error, if we did not find the entity. */
    if (!document) {
        throw new NotFoundError(
            "Could not find any screen with the specified identifier.",
        );
    }

    return toExternal(document);
};

export const getByName = async (
    context: any,
    name: string,
): Promise<IExternalScreen> => {
    if (!constants.namePattern.test(name)) {
        throw new BadRequestError("The specified name is invalid.");
    }

    const document = await ScreenModel.findOne({
        name,
        status: { $ne: "deleted" },
        creator: context.user._id,
    }).exec();
    /* We return a 404 error, if we did not find the entity. */
    if (!document) {
        throw new NotFoundError(
            "Could not find any screen with the specified identifier.",
        );
    }

    return toExternal(document);
};

export const remove = async (context: any, id: string) => {
    if (!constants.identifierPattern.test(id)) {
        throw new BadRequestError(
            "The specified screen identifier is invalid.",
        );
    }

    const screen = await ScreenModel.findOneAndUpdate(
        {
            _id: id,
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
    if (!screen) {
        throw new NotFoundError(
            "Could not find any screen with the specified identifier.",
        );
    }

    return { success: true };
};

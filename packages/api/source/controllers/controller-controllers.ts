import {
    IController,
    IControllerPatch,
    IExternalController,
    InternalServerError,
    TControllerPage,
    runAsTransaction,
} from "@hypertool/common";
import {
    AppModel,
    BadRequestError,
    ControllerModel,
    NotFoundError,
    constants,
} from "@hypertool/common";

import { applyPatch, createTwoFilesPatch } from "diff";
import joi from "joi";
import { Types } from "mongoose";

import { checkAccessToApps, checkAccessToControllers } from "../utils";

const createSchema = joi.object({
    name: joi.string().regex(constants.namePattern).required(),
    description: joi.string().max(512).allow("").default(""),
    language: joi
        .string()
        .valid(...constants.controllerLanguages)
        .required(),
    patches: joi.array().items(
        joi.object({
            author: joi.string().regex(constants.identifierPattern),
            content: joi.string().allow(""),
        }),
    ),
    app: joi.string().regex(constants.identifierPattern).required(),
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

// TODO: Allow description to be updated
const updateSchema = joi.object({
    patches: joi.array().items(
        joi.object({
            author: joi.string().regex(constants.identifierPattern),
            content: joi.string().allow(""),
        }),
    ),
});

// TODO: Allow description to be updated
const updateWithSourceSchema = joi.object({
    source: joi.string().allow(""),
});

const patchAll = (patches: IControllerPatch[]) =>
    patches.reduce(
        (previousValue: string, currentValue: { content: string }) => {
            const patched = applyPatch(previousValue, currentValue.content);
            if (!patched) {
                throw new Error(
                    "Failed to apply patch: " + currentValue.content,
                );
            }
            return patched;
        },
        "",
    );

const toExternal = (controller: IController): IExternalController => {
    const {
        _id,
        name,
        description,
        language,
        creator,
        patches,
        status,
        createdAt,
        updatedAt,
    } = controller;

    /*
     * NOTE: At the moment, all the controllers provide unpopulated fields.
     * Therefore, we consider all the IDs to be of type ObjectId.
     */
    return {
        id: _id.toString(),
        name,
        description,
        language,
        creator: creator.toString(),
        patches: patches.map((patch) => {
            const { author, content, createdAt } = patch;
            return {
                author: author.toString(),
                content,
                createdAt,
            };
        }),
        patched: patchAll(patches),
        status,
        createdAt,
        updatedAt,
    };
};

export const create = async (
    context: any,
    attributes: any,
): Promise<IExternalController> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const newController = await runAsTransaction(async () => {
        const newControllerId = new Types.ObjectId();
        const app = await AppModel.findOneAndUpdate(
            {
                _id: value.app,
                status: { $ne: "deleted" },
            },
            {
                $push: {
                    controllers: newControllerId,
                },
            },
            {
                lean: true,
                new: true,
            },
        );
        if (!app) {
            throw new NotFoundError(
                `Cannot find an app with the specified identifier "${value.app}".`,
            );
        }

        /*
         * At this point, the app has been modified, regardless of the currently
         * user being authorized or not. When we check for access below, we rely
         * on the transaction failing to undo the changes.
         */
        checkAccessToApps(context.user, [app]);

        /* Check for the uniqueness of the controller name within the app. */
        const existingController = await ControllerModel.findOne({
            name: value.name,
            app: value.app,
            status: { $ne: "deleted" },
        });
        if (existingController) {
            throw new BadRequestError(
                `Controller with name "${value.name}" already exists.`,
            );
        }

        const newController = new ControllerModel({
            ...value,
            status: "created",
            creator: context.user._id,
        });
        await newController.save();

        return newController;
    });

    return toExternal(newController);
};

export const list = async (
    context: any,
    parameters: any,
): Promise<TControllerPage> => {
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

    const controllers = await (ControllerModel as any).paginate(
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
        totalRecords: controllers.totalDocs,
        totalPages: controllers.totalPages,
        previousPage: controllers.prevPage ? controllers.prevPage - 1 : -1,
        nextPage: controllers.nextPage ? controllers.nextPage - 1 : -1,
        hasPreviousPage: controllers.hasPrevPage,
        hasNextPage: controllers.hasNextPage,
        records: controllers.docs.map(toExternal),
    };
};

export const listByIds = async (
    context,
    controllerIds: string[],
): Promise<IExternalController[]> => {
    const controllers = await ControllerModel.find({
        _id: { $in: controllerIds },
        status: { $ne: "deleted" },
    }).exec();
    if (controllers.length !== controllerIds.length) {
        throw new NotFoundError(
            `Could not find controllers for every specified ID. Requested ${controllerIds.length} controllers, but found ${controllers.length} controllers.`,
        );
    }

    checkAccessToControllers(context.user, [controllers]);

    const object = {};
    for (const controller of controllers) {
        object[controller._id.toString()] = controller;
    }

    return controllerIds.map((key) => toExternal(object[key]));
};

export const getById = async (
    context: any,
    id: string,
): Promise<IExternalController> => {
    if (!constants.identifierPattern.test(id)) {
        throw new BadRequestError(
            `The specified controller identifier "${id}" is invalid.`,
        );
    }

    const controller = await ControllerModel.findOne(
        {
            _id: id,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();

    /* We return a 404 error, if we did not find the entity. */
    if (!controller) {
        throw new NotFoundError(
            `Cannot find a controller with the specified identifier "${id}".`,
        );
    }

    checkAccessToControllers(context.user, [controller]);

    return toExternal(controller);
};

export const getByName = async (
    context: any,
    name: string,
): Promise<IExternalController> => {
    if (!constants.namePattern.test(name)) {
        throw new BadRequestError(
            `The specified controller name "${name}" is invalid.`,
        );
    }

    const controller = await ControllerModel.findOne(
        {
            name,
            status: { $ne: "deleted" },
        },
        null,
        { lean: true },
    ).exec();

    /* We return a 404 error, if we did not find the entity. */
    if (!controller) {
        throw new NotFoundError(
            `Cannot find a controller with the specified name "${name}".`,
        );
    }

    checkAccessToControllers(context.user, [controller]);

    return toExternal(controller);
};

export const update = async (context: any, id: string, attributes: any) => {
    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const updatedController = await runAsTransaction(async () => {
        const updatedController = await ControllerModel.findOneAndUpdate(
            {
                _id: id,
                status: { $ne: "deleted" },
            },
            value,
            { new: true, lean: true },
        ).exec();

        if (!updatedController) {
            throw new NotFoundError(
                `Cannot find an app with the specified identifier "${value.app}".`,
            );
        }

        /*
         * At this point, the controller has been modified, regardless of the currently
         * user being authorized or not. When we check for access below, we rely
         * on the transaction failing to undo the changes.
         */
        checkAccessToControllers(context.user, [updatedController]);

        return updatedController;
    });

    return toExternal(updatedController);
};

export const updateWithSource = async (
    context: any,
    id: string,
    attributes: any,
): Promise<IExternalController> => {
    const { error, value } = updateWithSourceSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    const controller = await ControllerModel.findOne({
        _id: id,
        status: { $ne: "delete" },
    }).exec();
    if (!controller) {
        throw new NotFoundError(
            `Cannot find a controller with the specified identifier "${id}".`,
        );
    }

    checkAccessToControllers(context.user, [controller]);

    const oldSource = patchAll(controller.patches);
    const newPatch = createTwoFilesPatch(
        `a/${controller.name}`,
        `b/${controller.name}`,
        oldSource,
        value.source,
        "",
        "",
    );

    const updatedController = await ControllerModel.findByIdAndUpdate(
        id,
        {
            $push: {
                patches: {
                    author: context.user._id,
                    content: newPatch,
                },
            },
        },
        {
            new: true,
            lean: true,
        },
    ).exec();
    if (!updatedController) {
        throw new InternalServerError(
            "Failed to update and verify new controller state.",
        );
    }

    return toExternal(updatedController);
};

export const remove = async (context: any, id: string) => {
    if (!constants.identifierPattern.test(id)) {
        throw new BadRequestError(
            `The specified controller identifier "${id}" is invalid.`,
        );
    }

    await runAsTransaction(async () => {
        const controller = await ControllerModel.findOneAndUpdate(
            {
                _id: id,
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
        if (!controller) {
            throw new NotFoundError(
                `A controller with the specified identifier "${id}" does not exist.`,
            );
        }

        /*
         * At this point, the controller has been modified, regardless of the currently
         * user being authorized or not. When we check for access below, we rely
         * on the transaction failing to undo the changes.
         */
        checkAccessToControllers(context.user, [controller]);
    });

    return { success: true };
};

import {
    IController,
    IControllerPatch,
    IExternalController,
    NotFoundError,
    TControllerPage,
} from "@hypertool/common";
import {
    BadRequestError,
    ControllerModel,
    constants,
    controller,
} from "@hypertool/common";

import { applyPatch, createTwoFilesPatch } from "diff";
import joi from "joi";

const createSchema = joi.object({
    name: joi.string().max(256).required(),
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

const updateSchema = joi.object({
    patches: joi.array().items(
        joi.object({
            author: joi.string().regex(constants.identifierPattern),
            content: joi.string().allow(""),
        }),
    ),
});

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

const helper = controller.createHelper({
    entity: "controller",
    model: ControllerModel,
    toExternal,
});

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

    /*
     * TODO: Add `controller` to `app.controllers`
     * TODO: Check if value.creator is correct.
     * TODO: Check if value.name is unique across the organization and matches
     * the identifier regex.
     */
    const newController = new ControllerModel({
        ...value,
        status: "created",
        creator: context.user._id,
    });
    await newController.save();

    return toExternal(newController);
};

export const list = async (
    context: any,
    parameters: any,
): Promise<TControllerPage> => helper.list(context, parameters, filterSchema);

export const listByIds = async (
    context,
    ids: string[],
): Promise<IExternalController[]> => helper.listByIds(context, ids);

export const getById = async (
    context: any,
    id: string,
): Promise<IExternalController> => helper.getById(context, id);

export const getByName = async (
    context: any,
    name: string,
): Promise<IExternalController> => helper.getByName(context, name);

export const update = async (context: any, id: string, attributes: any) =>
    helper.update(context, id, attributes, updateSchema);

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
            `Could not find any controller with the specified identifier.`,
        );
    }

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
        throw new Error("Failed to update and verify new controller state.");
    }

    return toExternal(updatedController);
};

export const remove = async (context: any, id: string) => {
    if (!constants.identifierPattern.test(id)) {
        throw new BadRequestError(
            "The specified controller identifier is invalid.",
        );
    }

    // TODO: Update filters
    const controller = await ControllerModel.findOneAndUpdate(
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
    if (!controller) {
        throw new NotFoundError(
            "A controller with the specified identifier does not exist.",
        );
    }

    return { success: true };
};

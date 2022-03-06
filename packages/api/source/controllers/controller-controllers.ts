import type {
    IController,
    IExternalController,
    TControllerPage,
} from "@hypertool/common";
import {
    BadRequestError,
    ControllerModel,
    NotFoundError,
    constants,
    controller,
} from "@hypertool/common";

import joi from "joi";

const createSchema = joi.object({
    creator: joi.string().regex(constants.identifierPattern),
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toExternal = (controller: IController): IExternalController => {
    const { _id, creator, patches, status, createdAt, updatedAt } = controller;

    /*
     * NOTE: At the moment, all the controllers provide unpopulated fields.
     * Therefore, we consider all the IDs to be of type ObjectId.
     */
    return {
        id: _id.toString(),
        creator: creator.toString(),
        patches: patches.map((patch) => {
            const { author, content, createdAt } = patch;
            return {
                author: author.toString(),
                content,
                createdAt,
            };
        }),
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

    /*
     * TODO: Add `controller` to `app.controllers`
     * TODO: Check if value.creator is correct.
     * TODO: Check if value.name is unique across the organization and matches
     * the identifier regex.
     */
    const newController = new ControllerModel({
        ...value,
        status: "created",
    });
    await newController.save();

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

    // TODO: Update filters
    const filters = {
        status: {
            $ne: "deleted",
        },
    };
    const { page, limit } = value;

    const controllers = await (ControllerModel as any).paginate(filters, {
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
    const unorderedControllers = await ControllerModel.find({
        _id: { $in: controllerIds },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    for (const controller of unorderedControllers) {
        object[controller._id.toString()] = controller;
    }
    return controllerIds.map((key) => toExternal(object[key]));
};

export const getById = async (
    context: any,
    controllerId: string,
): Promise<IExternalController> => {
    if (!constants.identifierPattern.test(controllerId)) {
        throw new BadRequestError(
            "The specified controller identifier is invalid.",
        );
    }

    // TODO: Update filters
    const filters = {
        _id: controllerId,
        status: { $ne: "deleted" },
    };
    const controller = await ControllerModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the controller. */
    if (!controller) {
        throw new NotFoundError(
            "Cannot find a controller with the specified identifier.",
        );
    }

    return toExternal(controller);
};

const helper = controller.createHelper({
    entity: "controller",
    model: ControllerModel,
    toExternal,
});

export const getByName = async (
    context: any,
    name: string,
): Promise<IExternalController> => helper.getByName(context, name);

export const update = async (context: any, id: string, attributes: any) =>
    helper.update(context, id, attributes, updateSchema);

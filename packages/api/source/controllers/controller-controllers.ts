import type { IController, IExternalController } from "@hypertool/common";
import { BadRequestError, ControllerModel, constants } from "@hypertool/common";

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

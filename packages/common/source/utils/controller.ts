import type { IControllerHelper, IControllerRequirements } from "../types";

import * as constants from "./constants";
import { BadRequestError, NotFoundError } from "./errors";

export const createHelper = <T, E>(
    requirements: IControllerRequirements<T, E>,
): IControllerHelper<E> => {
    const { entity, model, toExternal } = requirements;
    return {
        listByIds: async (context, ids: string[]): Promise<E[]> => {
            const items = await model
                .find({
                    _id: { $in: ids },
                    status: { $ne: "deleted" },
                })
                .exec();
            const object = {};
            for (const item of items) {
                object[item._id.toString()] = item;
            }
            return ids.map((key) => toExternal(object[key]));
        },

        getByName: async (context: any, name: string): Promise<E> => {
            if (!constants.namePattern.test(name)) {
                throw new BadRequestError(
                    `The specified ${entity} name is invalid.`,
                );
            }

            // TODO: Update filters
            const filters = {
                name,
                status: { $ne: "deleted" },
            };
            const controller = await model.findOne(filters as any).exec();

            /* We return a 404 error, if we did not find the controller. */
            if (!controller) {
                throw new NotFoundError(
                    `Could not find any ${entity} with the specified name.`,
                );
            }

            return toExternal(controller);
        },

        update: async (
            context: any,
            id: string,
            attributes: any,
            updateSchema: any,
        ): Promise<E> => {
            if (!constants.identifierPattern.test(id)) {
                throw new BadRequestError(
                    `The specified ${entity} identifier is invalid.`,
                );
            }

            const { error, value } = updateSchema.validate(attributes, {
                stripUnknown: true,
            });
            if (error) {
                throw new BadRequestError(error.message);
            }

            // TODO: Update filters
            const document = await model
                .findOneAndUpdate(
                    {
                        _id: id,
                        status: { $ne: "deleted" },
                    },
                    value,
                    {
                        new: true,
                        lean: true,
                    },
                )
                .exec();

            if (!document) {
                throw new NotFoundError(
                    `Could not find ${entity} with the specified identifier.`,
                );
            }

            return toExternal(document);
        },
    };
};

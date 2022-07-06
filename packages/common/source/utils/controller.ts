import type {
    IControllerHelper,
    IControllerRequirements,
    IExternalListPage,
} from "../types";

import * as constants from "./constants";
import { BadRequestError, NotFoundError } from "./errors";

export const createHelper = <T, E>(
    requirements: IControllerRequirements<T, E>,
): IControllerHelper<E> => {
    const { entity, model, toExternal } = requirements;
    return {
        getById: async (context: any, id: string): Promise<E> => {
            if (!constants.identifierPattern.test(id)) {
                throw new BadRequestError(
                    `The specified ${entity} identifier is invalid.`,
                );
            }

            // TODO: Update filters
            const filters = {
                _id: id,
                status: { $ne: "deleted" },
            };
            const document = await model.findOne(filters as any).exec();

            /* We return a 404 error, if we did not find the entity. */
            if (!document) {
                throw new NotFoundError(
                    `Could not find any ${entity} with the specified identifier.`,
                );
            }

            return toExternal(document);
        },

        list: async (
            context: any,
            parameters: any,
            filterSchema: any,
        ): Promise<IExternalListPage<E>> => {
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

            const documents = await (model as any).paginate(filters, {
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
                totalRecords: documents.totalDocs,
                totalPages: documents.totalPages,
                previousPage: documents.prevPage ? documents.prevPage - 1 : -1,
                nextPage: documents.nextPage ? documents.nextPage - 1 : -1,
                hasPreviousPage: documents.hasPrevPage,
                hasNextPage: documents.hasNextPage,
                records: documents.docs.map(toExternal),
            };
        },

        listByIds: async (context: any, ids: string[]): Promise<E[]> => {
            const items = await model
                .find({
                    _id: { $in: ids },
                    status: { $ne: "deleted" },
                } as any)
                .exec();
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
                    } as any,
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

            return toExternal(document as any);
        },
    };
};

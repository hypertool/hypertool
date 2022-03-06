import type { Model } from "mongoose";

import type { TGetByNameFunction, TToExternalFunction } from "../types";

import * as constants from "./constants";
import { BadRequestError, NotFoundError } from "./errors";

export const getByName: TGetByNameFunction = async <T, E>(
    entity: string,
    model: Model<T>,
    toExternal: TToExternalFunction<T, E>,
    context: any,
    name: string,
): Promise<E> => {
    if (!constants.namePattern.test(name)) {
        throw new BadRequestError(`The specified ${entity} name is invalid.`);
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
};

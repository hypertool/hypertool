import type { Document } from "mongoose";
import joi from "joi";
import type { Role } from "../types";

import RoleModel from "../models/RoleModel";

import {
    constants,
    BadRequestError,
    NotFoundError,
    extractIds,
} from "../utils";

const createSchema = joi.object({
    name: joi.string().max(512).required(),
    priviledges: joi.array().items(joi.string().max(512).required()),
});

const updateSchema = joi.object({
    name: joi.string(),
    priviledges: joi.array().items(joi.string().max(512)),
});

const create = async (context, attributes): Promise<Role> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const role = new RoleModel({
        ...value,
    });

    await role.save();

    return role;
};

const update = async (context, name, attributes): Promise<Role> => {
    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    const app = await RoleModel.findOneAndUpdate(
        {
            name,
        },
        value,
    ).exec();

    if (!app) {
        throw new NotFoundError(
            "A Role Model with the specified identifier does not exist.",
        );
    }

    return app;
};

export { create, update };

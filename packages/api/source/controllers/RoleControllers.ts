import type { Document } from "mongoose";
import joi from "joi";
import type { Role, RolePage } from "../types";

import RoleModel from "../models/RoleModel";

import {
    constants,
    BadRequestError,
    NotFoundError,
    extractIds,
} from "../utils";

const createSchema = joi.object({
    name: joi.string().max(512).required(),
    privileges: joi.array().items(joi.string().max(512).required()),
    enabled: joi.boolean().required(),
    description: joi.string().max(512),
});

const updateSchema = joi.object({
    name: joi.string(),
    privileges: joi.array().items(joi.string().max(512)),
    enabled: joi.boolean(),
    description: joi.string(),
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

    const role = await RoleModel.findOneAndUpdate(
        {
            name,
        },
        value,
    ).exec();

    if (!role) {
        throw new NotFoundError(
            "A Role Model with the specified identifier does not exist.",
        );
    }

    return role;
};

const list = async (context, parameters): Promise<RolePage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const filters = {};
    const { page, limit } = value;

    const roles = await (RoleModel as any).paginate(filters, {
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
        totalRecords: roles.totalDocs,
        totalPages: roles.totalPages,
        previousPage: roles.prevPage ? roles.prevPage - 1 : -1,
        nextPage: roles.nextPage ? roles.nextPage - 1 : -1,
        hasPreviousPage: roles.hasPrevPage,
        hasNextPage: roles.hasNextPage,
        records: roles,
    };
};

const listById = async (context, name: String): Promise<Role> => {
    const role = await RoleModel.findOne({ name } as any).exec();

    if (!role) {
        throw new NotFoundError("Cannot find a Role with the specified name.");
    }

    return role;
};

const remove = async (context, name: String): Promise<{ success: Boolean }> => {
    const role = await RoleModel.findOne({ name } as any).exec();
    if (!role) {
        throw new NotFoundError("Cannot find a Role with the specified name");
    }

    await role.remove();

    return { success: true };
};

export { create, update, list, listById, remove };

import type { Document } from "mongoose";

import joi from "joi";

import type { Group, GroupPage, ExternalGroup } from "../types";

import {
    constants,
    BadRequestError,
    NotFoundError,
    extractIds,
} from "../utils";
import { GroupModel } from "../models";

const createSchema = joi.object({
    name: joi.string().max(256).allow(""),
    description: joi.string().max(512).allow(""),
    users: joi.array().items(joi.string().regex(constants.identifierPattern)),
    apps: joi.array().items(joi.string().regex(constants.identifierPattern)),
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
    name: joi.string().max(256).allow(""),
    description: joi.string().max(512).allow(""),
    users: joi.array().items(joi.string().regex(constants.identifierPattern)),
    apps: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const toExternal = (group: Group & Document<Group>): ExternalGroup => {
    const {
        id,
        _id,
        name,
        description,
        type,
        users,
        apps,
        status,
        createdAt,
        updatedAt,
    } = group;

    return {
        id: id || _id.toString(),
        name,
        description,
        type,
        users: extractIds(users),
        apps: extractIds(apps),
        status,
        createdAt,
        updatedAt,
    };
};

const create = async (context, attributes): Promise<ExternalGroup> => {
    const { error, value } = createSchema.validate(attributes, {
        stripUnknown: true,
    });

    if (error) {
        throw new BadRequestError(error.message);
    }

    // Add `group` to `app.groups`.
    const newGroup = new GroupModel({
        ...value,
        status: "enabled",
    });
    await newGroup.save();

    return toExternal(newGroup);
};

const list = async (context, parameters): Promise<GroupPage> => {
    const { error, value } = filterSchema.validate(parameters);
    if (error) {
        throw new BadRequestError(error.message);
    }

    const filters = {
        status: {
            $ne: "deleted",
        },
    };
    const { page, limit } = value;

    const groups = await (GroupModel as any).paginate(filters, {
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
        totalRecords: groups.totalDocs,
        totalPages: groups.totalPages,
        previousPage: groups.prevPage ? groups.prevPage - 1 : -1,
        nextPage: groups.nextPage ? groups.nextPage - 1 : -1,
        hasPreviousPage: groups.hasPrevPage,
        hasNextPage: groups.hasNextPage,
        records: groups.docs.map(toExternal),
    };
};

const listByIds = async (
    context,
    groupIds: string[]
): Promise<ExternalGroup[]> => {
    const unorderedGroups = await GroupModel.find({
        _id: { $in: groupIds },
        status: { $ne: "deleted" },
    }).exec();
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const group of unorderedGroups) {
        object[group._id] = group;
    }
    // eslint-disable-next-line security/detect-object-injection
    return groupIds.map((key) => toExternal(object[key]));
};

const getById = async (context, groupId: string): Promise<ExternalGroup> => {
    if (!constants.identifierPattern.test(groupId)) {
        throw new BadRequestError("The specified group identifier is invalid.");
    }

    // TODO: Update filters
    const filters = {
        _id: groupId,
    };
    const group = await GroupModel.findOne(filters as any).exec();

    /* We return a 404 error, if we did not find the group. */
    if (!group) {
        throw new NotFoundError(
            "Cannot find a group with the specified identifier."
        );
    }

    return toExternal(group);
};

const update = async (
    context,
    groupId: string,
    attributes
): Promise<ExternalGroup> => {
    if (!constants.identifierPattern.test(groupId)) {
        throw new BadRequestError("The specified group identifier is invalid.");
    }

    const { error, value } = updateSchema.validate(attributes, {
        stripUnknown: true,
    });
    if (error) {
        throw new BadRequestError(error.message);
    }

    // TODO: Update filters
    const group = await GroupModel.findOneAndUpdate(
        {
            _id: groupId,
        },
        value,
        {
            new: true,
            lean: true,
        }
    ).exec();

    if (!group) {
        throw new NotFoundError(
            "A group with the specified identifier does not exist."
        );
    }

    return toExternal(group);
};

const remove = async (
    context,
    groupId: string
): Promise<{ success: boolean }> => {
    if (!constants.identifierPattern.test(groupId)) {
        throw new BadRequestError("The specified group identifier is invalid.");
    }

    // TODO: Update filters
    const group = await GroupModel.findOneAndUpdate(
        {
            _id: groupId,
            status: { $ne: "deleted" },
        },
        {
            status: "deleted",
        },
        {
            new: true,
            lean: true,
        }
    );

    if (!group) {
        throw new NotFoundError(
            "A group with the specified identifier does not exist."
        );
    }

    return { success: true };
};

export { create, list, listByIds, getById, update, remove };

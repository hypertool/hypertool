import joi from "joi";

import type { Group, GroupPage, ExternalGroup } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { GroupModel } from "../models";

const createSchema = joi.object({
    name: joi.string().min(1).max(256),
    description: joi.string().min(0).max(512).allow(""),
    type: joi.string().valid(...constants.groupTypes).required(),
    status: joi.string().valid(...constants.groupStatuses).required(),
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
    name: joi.string().min(1).max(256),
    description: joi.string().min(0).max(512).allow(""),
    type: joi.string().valid(...constants.groupTypes).required(),
    status: joi.string().valid(...constants.groupStatuses).required(),
    users: joi.array().items(joi.string().regex(constants.identifierPattern)),
    apps: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const toExternal = (group: Group): ExternalGroup => {
    const { name, description, type, users, apps, status } = group;
  
    return {
      name,
      description,
      type,
      users:
        users.length > 0
          ? typeof users[0] === "string"
            ? users
            : users.map((user) => user.id)
          : [],
      apps:
        apps.length > 0
          ? typeof apps[0] === "string"
            ? apps
            : apps.map((app) => app.id)
          : [],
      status,
    };
  };

const create = async (context, attributes): Promise<ExternalGroup> => {
  const { error, value } = createSchema.validate(attributes, {
    stripUnknown: true,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Check if value.creator is correct.
  // TODO: Check if value.name is unique across the organization and matches the identifier regex.
  const newGroup = new GroupModel({
    ...value,
    status: "active",
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
  };  const { page, limit } = value;

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

const getById = async (
  context,
  groupId: string
): Promise<ExternalGroup> => {
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

export { create, list, getById, update, remove };

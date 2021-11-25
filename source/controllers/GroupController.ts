import joi from "joi";

import type { Group, GroupPage } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { GroupModel } from "../models";

const createSchema = joi.object({
    name: joi.string().min(1).max(256),
    description: joi.string().min(0).max(512).allow(""),
    type: joi.string().valid(...constants.groupTypes).required(),
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
    users: joi.array().items(joi.string().regex(constants.identifierPattern)),
    apps: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const create = async (context, attributes): Promise<Group> => {
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

  return newGroup;
};

const list = async (context, parameters): Promise<GroupPage> => {
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

  const users = await (GroupModel as any).paginate(filters, {
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
    totalRecords: users.totalDocs,
    totalPages: users.totalPages,
    previousPage: users.prevPage ? users.prevPage - 1 : -1,
    nextPage: users.nextPage ? users.nextPage - 1 : -1,
    hasPreviousPage: users.hasPrevPage,
    hasNextPage: users.hasNextPage,
    records: users.docs,
  };
};

const getById = async (
  context,
  userId: string
): Promise<Group> => {
  if (!constants.identifierPattern.test(userId)) {
    throw new BadRequestError("The specified group identifier is invalid.");
  }

  // TODO: Update filters
  const filters = {
    _id: userId,
    status: { $ne: "deleted" },
  };
  const group = await GroupModel.findOne(filters as any).exec();

  /* We return a 404 error, if we did not find the group. */
  if (!group) {
    throw new NotFoundError(
      "Cannot find a group with the specified identifier."
    );
  }

  return group;
};

const update = async (
  context,
  userId: string,
  attributes
): Promise<Group> => {
  if (!constants.identifierPattern.test(userId)) {
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
      _id: userId,
      status: { $ne: "removed" },
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

  return group;
};

const remove = async (
  context,
  userId: string
): Promise<{ success: boolean }> => {
  if (!constants.identifierPattern.test(userId)) {
    throw new BadRequestError("The specified group identifier is invalid.");
  }

  // TODO: Update filters
  const group = await GroupModel.findOneAndUpdate(
    {
      _id: userId,
      status: { $ne: "removed" },
    },
    {
      status: "removed",
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

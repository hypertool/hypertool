import joi from "joi";

import type { User } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { UserModel } from "../models";

const createSchema = joi.object({
  firstName: joi.string().min(1).max(256).required(),
  lastName: joi.string().max(256).allow("").required(),
  description: joi.string().min(0).max(512).allow("").required(),
  gender: joi.string().valid(...constants.genders).required(),
  countryCode: joi.string().valid(...constants.countryCodes).required(),
  pictureURL: joi.string().allow(""),
  emailAddress: joi.string().max(256).required(),
  emailVerified: joi.string().allow(""),
  birthday: joi.date().allow(null),
  status: joi.string().valid(...constants.userStatuses),
  role: joi.string().valid(...constants.userRoles),
  groups: joi.array().items(joi.string().regex(constants.identifierPattern)),
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
    firstName: joi.string().min(1).max(256).required(),
    lastName: joi.string().max(256).allow("").required(),
    description: joi.string().min(0).max(512).allow("").required(),
    gender: joi.string().valid(...constants.genders).required(),
    countryCode: joi.string().valid(...constants.countryCodes).required(),
    pictureURL: joi.string().allow(""),
    emailAddress: joi.string().max(256).required(),
    emailVerified: joi.string().allow(""),
    birthday: joi.date().allow(null),
    status: joi.string().valid(...constants.userStatuses),
    role: joi.string().valid(...constants.userRoles),
    groups: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const create = async (context, attributes): Promise<User> => {
  const { error, value } = createSchema.validate(attributes, {
    stripUnknown: true,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Check if value.creator is correct.
  // TODO: Check if value.name is unique across the organization and matches the identifier regex.
  const newUser = new UserModel({
    ...value,
    status: "active",
  });
  await newUser.save();

  return newUser;
};

const list = async (context, parameters): Promise<UserPage> => {
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

  const users = await (UserModel as any).paginate(filters, {
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

const listByIds = async (
  context,
  resourceIds: string[]
): Promise<User[]> => {
  const unorderedResources = await UserModel.find({
    _id: { $in: resourceIds },
    status: { $ne: "deleted" },
  }).exec();
  const object = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const resource of unorderedResources) {
    object[resource._id] = resource;
  }
  // eslint-disable-next-line security/detect-object-injection
  return resourceIds.map((key) => toExternal(object[key]));
};

const getById = async (
  context,
  resourceId: string
): Promise<User> => {
  if (!constants.identifierPattern.test(resourceId)) {
    throw new BadRequestError("The specified resource identifier is invalid.");
  }

  // TODO: Update filters
  const filters = {
    _id: resourceId,
    status: { $ne: "deleted" },
  };
  const resource = await UserModel.findOne(filters as any).exec();

  /* We return a 404 error, if we did not find the resource. */
  if (!resource) {
    throw new NotFoundError(
      "Cannot find a resource with the specified identifier."
    );
  }

  return resource;
};

const update = async (
  context,
  resourceId: string,
  attributes
): Promise<User> => {
  if (!constants.identifierPattern.test(resourceId)) {
    throw new BadRequestError("The specified resource identifier is invalid.");
  }

  const { error, value } = updateSchema.validate(attributes, {
    stripUnknown: true,
  });
  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Update filters
  const resource = await UserModel.findOneAndUpdate(
    {
      _id: resourceId,
      status: { $ne: "deleted" },
    },
    value,
    {
      new: true,
      lean: true,
    }
  ).exec();

  if (!resource) {
    throw new NotFoundError(
      "A resource with the specified identifier does not exist."
    );
  }

  return resource;
};

const enable = async (
  context,
  resourceId: string
): Promise<User> => {
  if (!constants.identifierPattern.test(resourceId)) {
    throw new BadRequestError("The specified resource identifier is invalid.");
  }

  // TODO: Update filters
  const resource = await UserModel.findOneAndUpdate(
    {
      _id: resourceId,
      status: { $ne: "deleted" },
    },
    {
      status: "enabled",
    },
    {
      new: true,
      lean: true,
    }
  );

  if (!resource) {
    throw new NotFoundError(
      "A resource with the specified identifier does not exist."
    );
  }

  return resource;
};

const disable = async (
  context,
  resourceId: string
): Promise<User> => {
  if (!constants.identifierPattern.test(resourceId)) {
    throw new BadRequestError("The specified resource identifier is invalid.");
  }

  // TODO: Update filters
  const resource = await UserModel.findOneAndUpdate(
    {
      _id: resourceId,
      status: { $ne: "deleted" },
    },
    {
      status: "disabled",
    },
    {
      new: true,
      lean: true,
    }
  );

  if (!resource) {
    throw new NotFoundError(
      "A resource with the specified identifier does not exist."
    );
  }

  return resource;
};

/**
 * Before a resource is deleted, all the apps using it should stop using it.
 * TODO: If there are any apps using the app, the request should fail with appropriate
 * explanation.
 */
const remove = async (
  context,
  resourceId: string
): Promise<{ success: boolean }> => {
  if (!constants.identifierPattern.test(resourceId)) {
    throw new BadRequestError("The specified resource identifier is invalid.");
  }

  // TODO: Update filters
  const resource = await UserModel.findOneAndUpdate(
    {
      _id: resourceId,
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

  if (!resource) {
    throw new NotFoundError(
      "A resource with the specified identifier does not exist."
    );
  }

  return { success: true };
};

export { create, list, listByIds, getById, update, enable, disable, remove };

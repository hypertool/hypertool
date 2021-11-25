import joi from "joi";

import type { User, UserPage, ExternalUser } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { UserModel } from "../models";

const createSchema = joi.object({
  firstName: joi.string().min(1).max(256).required(),
  lastName: joi.string().max(256).allow("").required(),
  description: joi.string().min(0).max(512).allow("").required(),
  organization: joi.string().regex(constants.identifierPattern),
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
    organization: joi.string().regex(constants.identifierPattern),
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

const toExternal = (user: User): ExternalUser => {
  const { 
    firstName, 
    lastName, 
    description,
    organization, 
    gender, 
    countryCode, 
    pictureURL, 
    emailAddress, 
    emailVerified, 
    birthday, 
    status, 
    role, 
    groups } = user;

  return {
    firstName, 
    lastName, 
    description, 
    organization,
    gender, 
    countryCode, 
    pictureURL, 
    emailAddress, 
    emailVerified, 
    birthday, 
    status, 
    role,
    groups:
      groups.length > 0
        ? typeof groups[0] === "string"
          ? groups
          : groups.map((group) => group.id)
        : [],
  };
};

const create = async (context, attributes): Promise<ExternalUser> => {
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

  return toExternal(newUser);
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
    records: users.docs.map(toExternal),
  };
};

const getById = async (
  context,
  userId: string
): Promise<ExternalUser> => {
  if (!constants.identifierPattern.test(userId)) {
    throw new BadRequestError("The specified user identifier is invalid.");
  }

  // TODO: Update filters
  const filters = {
    _id: userId,
    status: { $ne: "deleted" },
  };
  const user = await UserModel.findOne(filters as any).exec();

  /* We return a 404 error, if we did not find the user. */
  if (!user) {
    throw new NotFoundError(
      "Cannot find a user with the specified identifier."
    );
  }

  return toExternal(user);
};

const update = async (
  context,
  userId: string,
  attributes
): Promise<ExternalUser> => {
  if (!constants.identifierPattern.test(userId)) {
    throw new BadRequestError("The specified user identifier is invalid.");
  }

  const { error, value } = updateSchema.validate(attributes, {
    stripUnknown: true,
  });
  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Update filters
  const user = await UserModel.findOneAndUpdate(
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

  if (!user) {
    throw new NotFoundError(
      "A user with the specified identifier does not exist."
    );
  }

  return toExternal(user);
};

const activate = async (
  context,
  userId: string
): Promise<ExternalUser> => {
  if (!constants.identifierPattern.test(userId)) {
    throw new BadRequestError("The specified user identifier is invalid.");
  }

  // TODO: Update filters
  const user = await UserModel.findOneAndUpdate(
    {
      _id: userId,
      status: { $ne: "removed" },
    },
    {
      status: "activated",
    },
    {
      new: true,
      lean: true,
    }
  );

  if (!user) {
    throw new NotFoundError(
      "A user with the specified identifier does not exist."
    );
  }

  return toExternal(user);
};

const invite = async (
    context,
    userId: string
  ): Promise<ExternalUser> => {
    if (!constants.identifierPattern.test(userId)) {
      throw new BadRequestError("The specified user identifier is invalid.");
    }
  
    // TODO: Update filters
    const user = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        status: { $ne: "removed" },
      },
      {
        status: "invited",
      },
      {
        new: true,
        lean: true,
      }
    );
  
    if (!user) {
      throw new NotFoundError(
        "A user with the specified identifier does not exist."
      );
    }
  
    return toExternal(user);
  };

const remove = async (
  context,
  userId: string
): Promise<{ success: boolean }> => {
  if (!constants.identifierPattern.test(userId)) {
    throw new BadRequestError("The specified user identifier is invalid.");
  }

  // TODO: Update filters
  const user = await UserModel.findOneAndUpdate(
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

  if (!user) {
    throw new NotFoundError(
      "A user with the specified identifier does not exist."
    );
  }

  return { success: true };
};

// changeRole (userId, role) -> Make user Owner/Editor/Viewer
// addToGroup (userId, groupId)
// removeFromGroup (userId, groupId)

export { create, list, getById, update, activate, invite, remove };

import joi from "joi";

import type { Organization, ExternalOrganization } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { OrganizationModel } from "../models";

const createSchema = joi.object({
  name: joi.string().min(0).max(256).allow(""),
  description: joi.string().min(0).max(512).allow(""),
  status: joi.string().valid(...constants.organizationStatuses).required(),
  users: joi.array().items(joi.string().regex(constants.identifierPattern)),
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
    name: joi.string().min(0).max(256).allow(""),
    description: joi.string().min(0).max(512).allow(""),
    status: joi.string().valid(...constants.organizationStatuses).required(),
    users: joi.array().items(joi.string().regex(constants.identifierPattern)),
});

const toExternal = (organization: Organization): ExternalOrganization => {
  const { name, description, users, status } = organization;

  return {
    name,
    description,
    users:
      users.length > 0
        ? typeof users[0] === "string"
          ? users
          : users.map((user) => user.id)
        : [],
    status,
  };
};

const create = async (context, attributes): Promise<ExternalOrganization> => {
  const { error, value } = createSchema.validate(attributes, {
    stripUnknown: true,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  const newOrganization = new OrganizationModel({
    ...value,
    status: "active",
  });
  await newOrganization.save();

  return toExternal(newOrganization);
};

const getById = async (
  context,
  organizationId: string
): Promise<ExternalOrganization> => {
  if (!constants.identifierPattern.test(organizationId)) {
    throw new BadRequestError("The specified organization identifier is invalid.");
  }

  // TODO: Update filters
  const filters = {
    _id: organizationId,
  };
  const group = await OrganizationModel.findOne(filters as any).exec();

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
  organizationId: string,
  attributes
): Promise<ExternalOrganization> => {
  if (!constants.identifierPattern.test(organizationId)) {
    throw new BadRequestError("The specified organization identifier is invalid.");
  }

  const { error, value } = updateSchema.validate(attributes, {
    stripUnknown: true,
  });
  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Update filters
  const organization = await OrganizationModel.findOneAndUpdate(
    {
      _id: organizationId,
      status: { $ne: "deleted" },
    },
    value,
    {
      new: true,
      lean: true,
    }
  ).exec();

  if (!organization) {
    throw new NotFoundError(
      "A organization with the specified identifier does not exist."
    );
  }

  return toExternal(organization);
};


const remove = async (
  context,
  organizationId: string
): Promise<{ success: boolean }> => {
  if (!constants.identifierPattern.test(organizationId)) {
    throw new BadRequestError("The specified organization identifier is invalid.");
  }

  // TODO: Update filters
  const organization = await OrganizationModel.findOneAndUpdate(
    {
      _id: organizationId,
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

  if (!organization) {
    throw new NotFoundError(
      "A organization with the specified identifier does not exist."
    );
  }

  return { success: true };
};


export { create, update, remove, getById };

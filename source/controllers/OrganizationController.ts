import joi from "joi";

import type { Organization } from "../types";

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

const create = async (context, attributes): Promise<Organization> => {
  const { error, value } = createSchema.validate(attributes, {
    stripUnknown: true,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Check if value.creator is correct.
  // TODO: Check if value.name is unique across the organization and matches the identifier regex.
  const newOrganization = new OrganizationModel({
    ...value,
    status: "active",
  });
  await newOrganization.save();

  return newOrganization;
};

const update = async (
  context,
  organizationId: string,
  attributes
): Promise<Organization> => {
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

  return organization;
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


export { create, update, remove };

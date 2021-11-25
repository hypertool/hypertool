import joi from "joi";

import type { Organization, ExternalOrganization, OrganizationPage } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { OrganizationModel } from "../models";

const createSchema = joi.object({
  name: joi.string().max(256).allow(""),
  description: joi.string().max(512).allow(""),
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
    name: joi.string().max(256).allow(""),
    description: joi.string().max(512).allow(""),
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

const list = async (context, parameters): Promise<OrganizationPage> => {
  const { error, value } = filterSchema.validate(parameters);
  if (error) {
    throw new BadRequestError(error.message);
  }

  const filters = {
    status: {
      $ne: "deleted",
    },
  };  const { page, limit } = value;

  const organizations = await (OrganizationModel as any).paginate(filters, {
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
    totalRecords: organizations.totalDocs,
    totalPages: organizations.totalPages,
    previousPage: organizations.prevPage ? organizations.prevPage - 1 : -1,
    nextPage: organizations.nextPage ? organizations.nextPage - 1 : -1,
    hasPreviousPage: organizations.hasPrevPage,
    hasNextPage: organizations.hasNextPage,
    records: organizations.docs.map(toExternal),
  };
};

const listByIds = async (
  context,
  organizationIds: string[]
): Promise<ExternalOrganization[]> => {
  const unorderedOrganizations = await OrganizationModel.find({
    _id: { $in: organizationIds },
    status: { $ne: "deleted" },
  }).exec();
  const object = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const organization of unorderedOrganizations) {
    object[organization._id] = organization;
  }
  // eslint-disable-next-line security/detect-object-injection
  return organizationIds.map((key) => toExternal(object[key]));
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
      "Cannot find an organization with the specified identifier."
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
      "An organization with the specified identifier does not exist."
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
      "An organization with the specified identifier does not exist."
    );
  }

  return { success: true };
};


export { create, list, listByIds, getById, update, remove };

import joi from "joi";

import type { Resource, ExternalResource, ResourcePage } from "../types";

import { constants, BadRequestError, NotFoundError } from "../utils";
import { ResourceModel } from "../models";

const createSchema = joi.object({
  name: joi.string().min(0).max(256).allow(""),
  description: joi.string().min(0).max(512).allow(""),
  creator: joi.string().regex(constants.identifierPattern).required(),
  type: joi
    .string()
    .valid(...constants.resourceTypes)
    .required(),
  status: joi.string().valid(...constants.resourceStatuses).required(),
  mysql: joi.object({
    host: joi.string().required(),
    port: joi.number().integer().required(),
    databaseName: joi.string().required(),
    databaseUserName: joi.string().required(),
    databasePassword: joi.string().required(),
    connectUsingSSL: joi.boolean().default(false),
  }),
  postgres: joi.object({
    host: joi.string().required(),
    port: joi.number().integer().required(),
    databaseName: joi.string().required(),
    databaseUserName: joi.string().required(),
    databasePassword: joi.string().required(),
    connectUsingSSL: joi.boolean().default(false),
  }),
  mongodb: joi.object({
    host: joi.string().required(),
    port: joi.number().integer().required(),
    databaseName: joi.string().required(),
    databaseUserName: joi.string().required(),
    databasePassword: joi.string().required(),
    connectUsingSSL: joi.boolean().default(false),
  }),
  bigquery: joi.object({
    key: joi.any(),
  }),
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
  name: joi.string().min(1).max(256).allow(""),
  description: joi.string().min(0).max(512).allow(""),
  type: joi
    .string()
    .valid(...constants.resourceTypes)
    .required(),
  status: joi.string().valid(...constants.resourceStatuses).required(),
  mysql: joi.object({
    host: joi.string().required(),
    port: joi.number().integer().required(),
    databaseName: joi.string().required(),
    databaseUserName: joi.string().required(),
    databasePassword: joi.string().required(),
    connectUsingSSL: joi.boolean().default(false),
  }),
  postgres: joi.object({
    host: joi.string().required(),
    port: joi.number().integer().required(),
    databaseName: joi.string().required(),
    databaseUserName: joi.string().required(),
    databasePassword: joi.string().required(),
    connectUsingSSL: joi.boolean().default(false),
  }),
  mongodb: joi.object({
    host: joi.string().required(),
    port: joi.number().integer().required(),
    databaseName: joi.string().required(),
    databaseUserName: joi.string().required(),
    databasePassword: joi.string().required(),
    connectUsingSSL: joi.boolean().default(false),
  }),
  bigquery: joi.object({
    key: joi.any(),
  }),
});

const toExternal = (resource: Resource): ExternalResource => {
  const { id, name, description, type, configuration, status } = resource;
  let sanitizedConfiguration = null;
  switch (type) {
    case "mysql":
    case "postgres":
    case "mongodb": {
      const { host, port, databaseName, databaseUserName, connectUsingSSL } =
        configuration;
      sanitizedConfiguration = {
        host,
        port,
        databaseName,
        databaseUserName,
        connectUsingSSL,
      };
      break;
    }

    case "bigquery": {
      sanitizedConfiguration = configuration;
      break;
    }

    default: {
      throw new Error(`Unknown resource type "${type}"`);
    }
  }

  return {
    id,
    name,
    description,
    type,
    configuration: sanitizedConfiguration,
    status,
  };
};

const create = async (context, attributes): Promise<ExternalResource> => {
  const { error, value } = createSchema.validate(attributes, {
    stripUnknown: true,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  // TODO: Check if value.creator is correct.
  // TODO: Check if value.name is unique across the organization and matches the identifier regex.
  const newResource = new ResourceModel({
    ...value,
    status: "enabled",
  });
  await newResource.save();

  return toExternal(newResource);
};

const list = async (context, parameters): Promise<ResourcePage> => {
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

  const resources = await (ResourceModel as any).paginate(filters, {
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
    totalRecords: resources.totalDocs,
    totalPages: resources.totalPages,
    previousPage: resources.prevPage ? resources.prevPage - 1 : -1,
    nextPage: resources.nextPage ? resources.nextPage - 1 : -1,
    hasPreviousPage: resources.hasPrevPage,
    hasNextPage: resources.hasNextPage,
    records: resources.docs.map(toExternal),
  };
};

const listByIds = async (
  context,
  resourceIds: string[]
): Promise<ExternalResource[]> => {
  const unorderedResources = await ResourceModel.find({
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
): Promise<ExternalResource> => {
  if (!constants.identifierPattern.test(resourceId)) {
    throw new BadRequestError("The specified resource identifier is invalid.");
  }

  // TODO: Update filters
  const filters = {
    _id: resourceId,
    status: { $ne: "deleted" },
  };
  const resource = await ResourceModel.findOne(filters as any).exec();

  /* We return a 404 error, if we did not find the resource. */
  if (!resource) {
    throw new NotFoundError(
      "Cannot find a resource with the specified identifier."
    );
  }

  return toExternal(resource);
};

const update = async (
  context,
  resourceId: string,
  attributes
): Promise<ExternalResource> => {
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
  const resource = await ResourceModel.findOneAndUpdate(
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

  return toExternal(resource);
};

const enable = async (
  context,
  resourceId: string
): Promise<ExternalResource> => {
  if (!constants.identifierPattern.test(resourceId)) {
    throw new BadRequestError("The specified resource identifier is invalid.");
  }

  // TODO: Update filters
  const resource = await ResourceModel.findOneAndUpdate(
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

  return toExternal(resource);
};

const disable = async (
  context,
  resourceId: string
): Promise<ExternalResource> => {
  if (!constants.identifierPattern.test(resourceId)) {
    throw new BadRequestError("The specified resource identifier is invalid.");
  }

  // TODO: Update filters
  const resource = await ResourceModel.findOneAndUpdate(
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

  return toExternal(resource);
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
  const resource = await ResourceModel.findOneAndUpdate(
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

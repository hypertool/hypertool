import joi from "joi";

import type { Resource, ExternalResource, ResourcePage } from "../types";

import { constants, BadRequestError } from "../utils";
import { ResourceModel } from "../models";

const createSchema = joi.object({
  name: joi.string().min(1).max(256).allow(""),
  description: joi.string().min(0).max(512).allow(""),
  creator: joi.string().regex(constants.identifierPattern).required(),
  type: joi
    .string()
    .valid(...constants.resourceTypes)
    .required(),
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

const toExternal = (resource: Resource): ExternalResource => {
  const { name, description, type, configuration, status } = resource;
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
    status: "private",
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

export { create, list };

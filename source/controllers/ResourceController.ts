import joi from "joi";

import type { Resource } from "../types";

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

interface ExternalMySQLConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  connectUsingSSL: boolean;
}

interface ExternalPostgresConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  connectUsingSSL: boolean;
}

interface ExternalMongoDBConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  connectUsingSSL: boolean;
}

interface ExternalBigQueryConfiguration {
  [key: string]: any;
}

interface ExternalResource {
  name: string;
  description: string;
  type: string;
  configuration:
    | ExternalMySQLConfiguration
    | ExternalPostgresConfiguration
    | ExternalMongoDBConfiguration
    | ExternalBigQueryConfiguration;
  status: string;
}

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

export { create };

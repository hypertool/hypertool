import joi from "joi";

import { constants } from "../utils";

const createSchema = joi.object({
  name: joi.string().min(1).max(256).allow(""),
  description: joi.string().min(0).max(512).allow(""),
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

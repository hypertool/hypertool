import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { Resource } from "../types";
import { resourceTypes, resourceStatuses } from "../utils/constants";

const mysqlSchema = new Schema({
  host: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  databaseName: {
    type: String,
    required: true,
  },
  databaseUserName: {
    type: String,
    required: true,
  },
  databasePassword: {
    type: String,
    required: true,
  },
  connectUsingSSL: {
    type: Boolean,
    required: true,
  },
});

const postgresSchema = new Schema({
  host: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  databaseName: {
    type: String,
    required: true,
  },
  databaseUserName: {
    type: String,
    required: true,
  },
  databasePassword: {
    type: String,
    required: true,
  },
  connectUsingSSL: {
    type: Boolean,
    required: true,
  },
});

const mongodbSchema = new Schema({
  host: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  databaseName: {
    type: String,
    required: true,
  },
  databaseUserName: {
    type: String,
    required: true,
  },
  databasePassword: {
    type: String,
    required: true,
  },
  connectUsingSSL: {
    type: Boolean,
    required: true,
  },
});

const bigquerySchema = new Schema({
  key: {
    type: Object,
    required: true,
  },
});

const resourceSchema = new Schema({
  name: {
    type: String,
    minlength: 0,
    maxlength: 256,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    minlength: 0,
    maxlength: 512,
    default: "",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: resourceTypes,
    required: true,
  },
  status: {
    type: String,
    enum: resourceStatuses,
    default: "enabled",
  },
  mysql: {
    type: mysqlSchema,
  },
  postgres: {
    type: postgresSchema,
  },
  mongodb: {
    type: mongodbSchema,
  },
  bigquery: {
    type: bigquerySchema,
  },
});

resourceSchema.plugin(paginate);

export default model<Resource>("Resource", resourceSchema);

import { resourceTypes } from "../utils/constants";

export type ResourceType = typeof resourceTypes[number];

export interface MySQLConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  databasePassword: string;
  connectUsingSSL: boolean;
}

export interface PostgresConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  databasePassword: string;
  connectUsingSSL: boolean;
}

export interface MongoDBConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  databasePassword: string;
  connectUsingSSL: boolean;
}

export interface BigQueryConfiguration {
  [key: string]: any;
}

export interface Resource {
  type: ResourceType;
  title: string;
  imageURL: string;
}

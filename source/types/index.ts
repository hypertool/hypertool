import { resourceTypes, resourceStatuses } from "../utils/constants";

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
  name: string;
  description: string;
  type: typeof resourceTypes[number];
  configuration:
    | MySQLConfiguration
    | PostgresConfiguration
    | MongoDBConfiguration
    | BigQueryConfiguration;
  status: typeof resourceStatuses[number];
}

export interface ExternalMySQLConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  connectUsingSSL: boolean;
}

export interface ExternalPostgresConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  connectUsingSSL: boolean;
}

export interface ExternalMongoDBConfiguration {
  host: string;
  port: number;
  databaseName: string;
  databaseUserName: string;
  connectUsingSSL: boolean;
}

export interface ExternalBigQueryConfiguration {
  [key: string]: any;
}

export interface ExternalResource {
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

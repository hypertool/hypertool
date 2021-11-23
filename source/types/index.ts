import {
  resourceTypes,
  resourceStatuses,
  appStatuses,
  countryCodes,
  userStatuses,
  genders,
  memberStatuses,
} from "../utils/constants";

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
  id: string;
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
  id: string;
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

export interface ExternalListPage<T> {
  totalRecords: number;
  totalPages: number;
  previousPage: number;
  nextPage: number;
  hasPreviousPage: number;
  hasNextPage: number;
  records: T[];
}

export type ResourcePage = ExternalListPage<ExternalResource>;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  description: string;
  gender: typeof genders[number];
  countryCode: typeof countryCodes[number];
  pictureURL: string;
  emailAddress: string;
  emailVerified: boolean;
  permissions: string[];
  birthday: Date;
  status: typeof userStatuses[number];
}

export interface Member {
  id: string;
  user: User;
  permissions: string[];
  status: typeof memberStatuses[number];
}

export interface App {
  id: string;
  name: string;
  description: string;
  members: string[] | Member[];
  resources: string[] | Resource[];
  creator: string[] | Member;
  status: typeof appStatuses[number];
}

export interface ExternalApp {
  name: string;
  description: string;
  members: string[];
  resources: string[];
  creator: string;
  status: typeof appStatuses[number];
}

export type AppPage = ExternalListPage<ExternalApp>;
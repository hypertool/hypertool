import {
  resourceTypes,
  resourceStatuses,
  organizationStatuses,
  appStatuses,
  countryCodes,
  userStatuses,
  userRoles,
  groupTypes,
  groupStatuses,
  genders,
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
  organization: string | Organization;
  gender: typeof genders[number];
  countryCode: typeof countryCodes[number];
  pictureURL: string;
  emailAddress: string;
  emailVerified: boolean;
  groups: string[] | Group[];
  role: typeof userRoles[number];
  birthday: Date;
  status: typeof userStatuses[number];
}
export interface ExternalUser {
  firstName: string;
  lastName: string;
  description: string;
  organization: string;
  gender: typeof genders[number];
  countryCode: typeof countryCodes[number];
  pictureURL: string;
  emailAddress: string;
  emailVerified: boolean;
  groups: string[] | Group[];
  role: typeof userRoles[number];
  birthday: Date;
  status: typeof userStatuses[number];
}

export type UserPage = ExternalListPage<ExternalUser>;

export interface Organization {
  id: string;
  name: string;
  description: string;
  users: string[] | User[];
  status: typeof organizationStatuses[number];
}

export interface ExternalOrganization {
  name: string,
  description: string,
  users: string[];
  status: typeof organizationStatuses[number];
}

export type OrganizationPage = ExternalListPage<ExternalOrganization>;

export interface Group {
  id: string;
  name: string;
  type: typeof groupTypes[number];
  description: string;
  users: string[] | User[];
  apps: string[] | App[];
  status: typeof groupStatuses[number];
}

export interface ExternalGroup {
  name: string,
  type: typeof groupTypes[number];
  description: string,
  users: string[];
  apps: string[];
  status: typeof groupStatuses[number];  
}

export type GroupPage = ExternalListPage<ExternalGroup>;

export interface App {
  id: string;
  name: string;
  description: string;
  groups: string[] | Group[];
  resources: string[] | Resource[];
  creator: string[] | User;
  status: typeof appStatuses[number];
}

export interface ExternalApp {
  name: string;
  description: string;
  resources: string[];
  groups: string[];
  creator: string;
  status: typeof appStatuses[number];
}

export type AppPage = ExternalListPage<ExternalApp>;

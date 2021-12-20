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
    queryStatuses,
    queryLifecycleStages,
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
    mysql: MySQLConfiguration | undefined;
    postgres: PostgresConfiguration | undefined;
    mongodb: MongoDBConfiguration | undefined;
    bigquery: BigQueryConfiguration | undefined;
    status: typeof resourceStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalMySQLConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

export interface ExternalPostgresConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

export interface ExternalMongoDBConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
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
    mysql: ExternalMySQLConfiguration | undefined;
    postgres: ExternalPostgresConfiguration | undefined;
    mongodb: ExternalMongoDBConfiguration | undefined;
    bigquery: ExternalBigQueryConfiguration | undefined;
    status: string;
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}
export interface ExternalUser {
    id: string;
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
    createdAt: Date;
    updatedAt: Date;
}

export type UserPage = ExternalListPage<ExternalUser>;

export interface Organization {
    id: string;
    name: string;
    description: string;
    users: string[] | User[];
    status: typeof organizationStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalOrganization {
    id: string;
    name: string;
    description: string;
    users: string[];
    status: typeof organizationStatuses[number];
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalGroup {
    id: string;
    name: string;
    type: typeof groupTypes[number];
    description: string;
    users: string[];
    apps: string[];
    status: typeof groupStatuses[number];
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalApp {
    id: string;
    name: string;
    description: string;
    resources: string[];
    groups: string[];
    creator: string;
    status: typeof appStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    jwtToken: string;
    user: ExternalUser;
    createdAt: Date;
}

export interface Query {
    name: string;
    description: string;
    resource: string;
    appId: string;
    content: string;
    status: typeof queryStatuses[number];
    lifecycle: typeof queryLifecycleStages[number];
    createdAt: Date;
    updatedAt: Date;
}

export type AppPage = ExternalListPage<ExternalApp>;

import { ObjectId } from "mongoose";
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
    componentOrigins,
    membershipStatuses,
    membershipTypes,
} from "../utils/constants";

/* General guidelines to keep in mind when writing interfaces for models.
 * 1. All identifiers must be of type `ObjectId`. Do not use strings.
 * 2. The identifier attribute in external types must be `id`.
 * 3. The identifier attribute in internal types must be `_id`.
 */

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
    _id: ObjectId;
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
    connection?: string;
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
    _id: ObjectId;
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

export interface Group {
    _id: ObjectId;
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
    _id: ObjectId;
    name: string;
    title: string;
    slug: string;
    description: string;
    organization: string | Organization;
    deployments: ObjectId[] | Deployment[];
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
    title: string;
    slug: string;
    description: string;
    resources: string[];
    deployments: string[];
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
    _id: ObjectId;
    name: string;
    description: string;
    resource: string | Resource;
    app: string | App;
    content: string;
    status: typeof queryStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalQuery {
    id: string;
    name: string;
    description: string;
    resource: string | ExternalResource;
    app: string | ExternalApp;
    content: string;
    status: typeof queryStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type AppPage = ExternalListPage<ExternalApp>;

export type QueryPage = ExternalListPage<ExternalQuery>;

export interface Context {
    type?: string;
    [x: string]: any;
}
export interface ActivityLog {
    _id: ObjectId;
    component: typeof componentOrigins[number];
    context: Context;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalActivityLog {
    id: string;
    component: typeof componentOrigins[number];
    context: Context;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ActivityLogPage = ExternalListPage<ExternalActivityLog>;

interface ManifestValues {
    [key: string]: any;
}

export interface Manifest {
    queries: Query[];
    resources: Resource[];
    app: App;
    file?: string;
    values?: ManifestValues;
}

export interface Deployment {
    _id: ObjectId;
    app: ObjectId | App;
    createdAt: Date;
    updatedAt: Date;
}
export interface Organization {
    id: string;
    name: string;
    title: string;
    description: string;
    members: string[] | Membership[];
    status: typeof organizationStatuses[number];
    apps: string[] | App[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalDeployment {
    id: string;
    app: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ExternalOrganization {
    id: string;
    name: string;
    title: string;
    description: string;
    members: string[] | Membership[];
    status: typeof organizationStatuses[number];
    apps: string[] | App[];
    createdAt: Date;
    updatedAt: Date;
}

export type OrganizationPage = ExternalListPage<ExternalOrganization>;

export interface Membership {
    id: string;
    member: string | User;
    inviter: string | User;
    division: string | Group | Organization;
    type: typeof membershipTypes[number];
    status: typeof membershipStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalMembership {
    id: string;
    member: string | User;
    inviter: string | User;
    division: string | Group | Organization;
    type: typeof membershipTypes[number];
    status: typeof membershipStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

import { ClientSession, ObjectId } from "mongoose";
import type { Model } from "mongoose";

import {
    appStatuses,
    componentOrigins,
    sourceFileStatuses,
    countryCodes,
    genders,
    organizationRoles,
    organizationStatuses,
    queryStatuses,
    resourceStatuses,
    resourceTypes,
    teamRoles,
    teamStatuses,
    userStatuses,
} from "../utils/constants";

/*
 * General guidelines to keep in mind when writing interfaces for models.
 * 1. All identifiers must be of type `ObjectId`. Do not use strings.
 * 2. The identifier attribute in external types must be `id` and of type string.
 * 3. The identifier attribute in internal types must be `_id` and of type `ObjectId`.
 * 4. Please maintain the following order while creating interfaces:
 *   - Users
 *   - Organizations
 *   - Teams
 *   - Apps
 *   - Resources
 *   - Queries
 *   - Conversations
 *   - Comments
 *   - SourceFiles
 *   - Activity Logs
 *
 * ---
 *
 * Each model has three interfaces associated with it:
 *
 * 1. Interface that is used within the API. It does not have any prefix or suffix
 * in its name. An example of this is `ISourceFile`.
 *
 * 2. Interface that is used by the `toExternal` utility function. This interface
 * describes the data that is exposed from the API. It is prepended with the
 * `External` suffix. An example of this is `IExternalSourceFile`.
 *
 * 3. Interface that i used within the client. It is prepended with the `Client`
 * suffix. An example of this is `IClientSourceFile`. The declaration for such
 * interfaces are not included in the `@hypertool/common` module. Instead, it
 * should be declared in `@hypertool/console` or `@hypertool/frontend-common`.
 */

/* Interfaces associated with the `User` model. */
export interface IUser {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    description: string;
    gender: typeof genders[number];
    countryCode: typeof countryCodes[number];
    pictureURL: string;
    emailAddress: string;
    password: string;
    emailVerified: boolean;
    birthday: Date;
    status: typeof userStatuses[number];
    app: ObjectId | IApp;
    organizations: string[] | IOrganization[];
    apps: string[] | IApp[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalUser {
    id: string;
    firstName: string;
    lastName: string;
    description: string;
    gender: typeof genders[number];
    countryCode: typeof countryCodes[number];
    pictureURL: string;
    emailAddress: string;
    emailVerified: boolean;
    birthday: Date;
    status: typeof userStatuses[number];
    app: string;
    organizations: string[];
    apps: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type TUserPage = IExternalListPage<IExternalUser>;
export interface MySQLConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

/* Interfaces associated with the `Organization` model. */
export interface IOrganizationMember {
    user: string | IUser;
    role: typeof organizationRoles[number];
}
export interface IOrganization {
    _id: ObjectId;
    name: string;
    title: string;
    description: string;
    members: IOrganizationMember[];
    apps: string[] | IApp[];
    teams: string[] | ITeam[];
    status: typeof organizationStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalOrganizationMember {
    user: string;
    role: typeof organizationRoles[number];
}

export interface IExternalOrganization {
    id: string;
    name: string;
    title: string;
    description: string;
    members: IExternalOrganizationMember[];
    apps: string[];
    teams: string[];
    status: typeof organizationStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type TOrganizationPage = IExternalListPage<IExternalOrganization>;

/* Interfaces associated with the `App` model. */
export interface IApp {
    _id: ObjectId;
    name: string;
    title: string;
    description: string;
    root: boolean;
    resources: ObjectId[] | IResource[];
    queryTemplates: ObjectId[] | IQueryTemplate[];
    deployments: ObjectId[] | Deployment[];
    sourceFiles: ObjectId[] | ISourceFile[];
    creator: ObjectId | IUser;
    organization: ObjectId | IOrganization;
    status: typeof appStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalApp {
    id: string;
    name: string;
    title: string;
    description: string;
    resources: string[];
    root: boolean;
    queryTemplates: string[];
    deployments: string[];
    sourceFiles: string[];
    creator: string;
    organization: string;
    status: typeof appStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type TAppPage = IExternalListPage<IExternalApp>;

/* Interfaces associated with the `Team` model. */
export interface ITeamMember {
    user: string | IUser;
    role: typeof teamRoles[number];
}
export interface ITeam {
    _id: ObjectId;
    name: string;
    description: string;
    organization: string | IOrganization;
    members: ITeamMember[];
    apps: string[] | IApp[];
    status: typeof teamStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalTeamMember {
    user: string;
    role: typeof teamRoles[number];
}

export interface IExternalTeam {
    id: string;
    name: string;
    description: string;
    organization: string;
    members: IExternalTeamMember[];
    apps: string[];
    status: typeof teamStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type TTeamPage = IExternalListPage<IExternalTeam>;

/* Interfaces associated with the `Resource` model. */
export interface IPostgresConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

export interface IMongoDBConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

export interface IBigQueryConfiguration {
    [key: string]: any;
}

export interface IResource {
    _id: ObjectId;
    name: string;
    description: string;
    type: typeof resourceTypes[number];
    app: string | IApp;
    mysql: MySQLConfiguration | undefined;
    postgres: IPostgresConfiguration | undefined;
    mongodb: IMongoDBConfiguration | undefined;
    bigquery: IBigQueryConfiguration | undefined;
    status: typeof resourceStatuses[number];
    creator: string | IUser;
    createdAt: Date;
    updatedAt: Date;
    connection?: string;
}

export interface IExternalMySQLConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

export interface IExternalPostgresConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

export interface IExternalMongoDBConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

export interface IExternalBigQueryConfiguration {
    [key: string]: any;
}

export interface IExternalResource {
    id: string;
    name: string;
    description: string;
    type: string;
    app: string;
    mysql: IExternalMySQLConfiguration | undefined;
    postgres: IExternalPostgresConfiguration | undefined;
    mongodb: IExternalMongoDBConfiguration | undefined;
    bigquery: IExternalBigQueryConfiguration | undefined;
    creator: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalListPage<T> {
    totalRecords: number;
    totalPages: number;
    previousPage: number;
    nextPage: number;
    hasPreviousPage: number;
    hasNextPage: number;
    records: T[];
}

export type TResourcePage = IExternalListPage<IExternalResource>;

export interface Session {
    jwtToken: string;
    user: IExternalUser;
    createdAt: Date;
}

export interface IQueryTemplate {
    _id: ObjectId;
    name: string;
    description: string;
    resource: string | IResource;
    app: string | IApp;
    content: string;
    creator: string | IUser;
    status: typeof queryStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalQueryTemplate {
    id: string;
    name: string;
    description: string;
    resource: string | IExternalResource;
    app: string | IExternalApp;
    content: string;
    creator: string;
    status: typeof queryStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type QueryPage = IExternalListPage<IExternalQueryTemplate>;

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

export type ActivityLogPage = IExternalListPage<ExternalActivityLog>;

interface ManifestValues {
    [key: string]: any;
}

export interface Manifest {
    queries: IQueryTemplate[];
    resources: IResource[];
    app: IApp;
    file?: string;
    values?: ManifestValues;
}

export interface Deployment {
    _id: ObjectId;
    app: ObjectId | IApp;
    createdAt: Date;
    updatedAt: Date;
}
export interface ExternalDeployment {
    id: string;
    app: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISourceFile {
    _id?: ObjectId;
    name: string;
    directory: boolean;
    creator: ObjectId | IUser;
    content: string;
    app: ObjectId | IApp;
    status: typeof sourceFileStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalSourceFile {
    id: string;
    name: string;
    directory: boolean;
    creator: string;
    content: string;
    app: string;
    status: typeof sourceFileStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type TSourceFilePage = IExternalListPage<IExternalSourceFile>;

export type TToExternalFunction<T, E> = (internal: T) => E;

export interface ISourceFileRequirements<T, E> {
    entity: string;
    model: Model<T>;
    toExternal: TToExternalFunction<T, E>;
}

export interface ISourceFileHelper<E> {
    getById: (context: any, id: string) => Promise<E>;
    list: (
        context: any,
        parameters: any,
        filterSchema: any,
    ) => Promise<IExternalListPage<E>>;
    listByIds: (context: any, ids: string[]) => Promise<E[]>;
    getByName: (context: any, name: string) => Promise<E>;
    update: (
        context: any,
        id: string,
        attributes: any,
        updateSchema: any,
    ) => Promise<E>;
}

export type TTransactionCallback<T> = (session: ClientSession) => Promise<T>;

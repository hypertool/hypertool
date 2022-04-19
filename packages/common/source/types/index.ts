import { ObjectId } from "mongoose";
import type { Model } from "mongoose";

import {
    appStatuses,
    commentStatuses,
    componentOrigins,
    controllerLanguages,
    controllerStatuses,
    conversationStatuses,
    countryCodes,
    genders,
    organizationRoles,
    organizationStatuses,
    queryStatuses,
    resourceStatuses,
    resourceTypes,
    screenStatuses,
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
 *   - Controllers
 *   - Activity Logs
 *
 * ---
 *
 * Each model has three interfaces associated with it:
 *
 * 1. Interface that is used within the API. It does not have any prefix or suffix
 * in its name. An example of this is `IController`.
 *
 * 2. Interface that is used by the `toExternal` utility function. This interface
 * describes the data that is exposed from the API. It is prepended with the
 * `External` suffix. An example of this is `IExternalController`.
 *
 * 3. Interface that i used within the client. It is prepended with the `Client`
 * suffix. An example of this is `IClientController`. The declaration for such
 * interfaces are not included in the `@hypertool/common` module. Instead, it
 * should be declared in `@hypertool/console` or `@hypertool/frontend-common`.
 */

/* Interfaces associated with the `User` model. */
export interface IUser {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    description: string;
    organizations: string[] | IOrganization[];
    apps: string[] | IApp[];
    gender: typeof genders[number];
    countryCode: typeof countryCodes[number];
    pictureURL: string;
    emailAddress: string;
    password: string;
    emailVerified: boolean;
    birthday: Date;
    status: typeof userStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalUser {
    id: string;
    firstName: string;
    lastName: string;
    description: string;
    organizations: string[];
    apps: string[];
    gender: typeof genders[number];
    countryCode: typeof countryCodes[number];
    pictureURL: string;
    emailAddress: string;
    emailVerified: boolean;
    birthday: Date;
    status: typeof userStatuses[number];
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
    slug: string;
    description: string;
    resources: ObjectId[] | IResource[];
    deployments: ObjectId[] | Deployment[];
    screens: ObjectId[] | IScreen[];
    controllers: ObjectId[] | IController[];
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
    slug: string;
    description: string;
    resources: string[];
    deployments: string[];
    screens: string[];
    controllers: string[];
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

export interface Query {
    _id: ObjectId;
    name: string;
    description: string;
    resource: string | IResource;
    app: string | IApp;
    content: string;
    status: typeof queryStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface ExternalQuery {
    id: string;
    name: string;
    description: string;
    resource: string | IExternalResource;
    app: string | IExternalApp;
    content: string;
    status: typeof queryStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type QueryPage = IExternalListPage<ExternalQuery>;

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
    queries: Query[];
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

export interface Comment {
    /* An identifier that uniquely identifies the comment across Hypertool. */
    _id: string;

    /* An identifier that points to the User whose created the comment. */
    author: ObjectId | IUser;

    /* A string that describes the contents of the comment. */
    content: string;

    /* A boolean value that describes if the comment is edited or not. */
    edited: boolean;

    /*
     * An enumeration of string values that describes the status of the
     * comment.
     */
    status: typeof commentStatuses[number];

    /*
     * An identifier that points to the Conversation where the comment was
     * created.
     */
    conversation: ObjectId | Conversation;

    /* Specifies the timestamp that indicates when the comment was created.  */
    createdAt: Date;

    /* Specifies the timestamp that indicates when the comment was last modified. */
    updatedAt: Date;
}

export interface ExternalComment {
    id: string;
    author: string | IUser;
    content: string;
    edited: boolean;
    status: typeof commentStatuses[number];
    conversation: string | Conversation;
    createdAt: Date;
    updatedAt: Date;
}

export type CommentPage = IExternalListPage<ExternalComment>;

export interface Coordinates {
    x: number;
    y: number;
}

export interface Conversation {
    /* An identifier uniquely identifies the conversation across Hypertool. */
    _id: string;

    /* An identifier that points to the App where the comment was created. */
    app: ObjectId | IApp;

    /* The name of the Page where the comment was created. */
    page: ObjectId | IScreen;

    /*
     * An object that describes the x and y coordinates of the conversation in
     * the canvas.
     */
    coordinates: Coordinates;

    /* A list of users who have participated in the conversation. */
    taggedUsers: [ObjectId | IUser];

    /*
     * A list of comments in the conversation. The first member is the
     * initiator’s comment.
     */
    comments: ObjectId[] | Comment[];

    /*
     * An enumeration of string values that describes the status of the
     * conversation.
     */
    status: typeof conversationStatuses[number];

    /* Specifies the timestamp that indicates when the conversation was created */
    createdAt: Date;

    /*
     * Specifies the timestamp that indicates when the conversation was last
     * modified
     */
    updatedAt: Date;
}

export interface IScreen {
    _id: ObjectId;

    /* An identifier that points to the App where the comment was created. */
    app: ObjectId | IApp;

    /**
     * The name of the screen, that uniquely identifies the screen across the
     * application.
     */
    name: string;

    /**
     * The title of the screen.
     */
    title: string;

    /**
     * Optional description of the screen.
     */
    description: string;

    /**
     * The slug of the screen.
     */
    slug: string;

    /**
     * The user interface implemented by the screen encoded in JSON.
     */
    content: string;

    /**
     * The controller associated with the screen.
     */
    controller: ObjectId | IController;

    /**
     * The status of the screen.
     */
    status: typeof screenStatuses[number];

    /**
     * Specifies the timestamp that indicates when the screen was created.
     */
    createdAt: Date;

    /**
     * Specifies the timestamp that indicates when the screen was last modified.
     */
    updatedAt: Date;
}

export interface IExternalScreen {
    id: string;
    app: string;
    name: string;
    title: string;
    description: string;
    slug: string;

    /**
     * The user interface implemented by the screen encoded in JSON.
     */
    content: string;

    /**
     * The controller associated with the screen.
     */
    controller: string;

    status: typeof screenStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type TScreenPage = IExternalListPage<IExternalScreen>;

export interface ExternalConversation {
    id: string;
    app: string;
    page: string;
    coordinates: Coordinates;
    taggedUsers: [string | IUser];
    comments: [string | Comment];
    status: typeof conversationStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type ConversationPage = IExternalListPage<ExternalConversation>;

export interface IControllerPatch {
    author: ObjectId | IUser;
    content: string;
    createdAt: Date;
}

export interface IController {
    _id?: ObjectId;
    name: string;
    description: string;
    language: typeof controllerLanguages[number];
    creator: ObjectId | IUser;
    patches: IControllerPatch[];
    status: typeof controllerStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalControllerPatch {
    author: string;
    content: string;
    createdAt: Date;
}

export interface IExternalController {
    id: string;
    name: string;
    description: string;
    language: typeof controllerLanguages[number];
    creator: string;
    patches: IExternalControllerPatch[];
    patched: string;
    status: typeof controllerStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type TControllerPage = IExternalListPage<IExternalController>;

export type TToExternalFunction<T, E> = (internal: T) => E;

export interface IControllerRequirements<T, E> {
    entity: string;
    model: Model<T>;
    toExternal: TToExternalFunction<T, E>;
}

export interface IControllerHelper<E> {
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

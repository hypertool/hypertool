import { ObjectId } from "mongoose";
import type { Model } from "mongoose";

import {
    appStatuses,
    commentStatuses,
    componentOrigins,
    controllerStatuses,
    conversationStatuses,
    countryCodes,
    genders,
    groupStatuses,
    groupTypes,
    membershipStatuses,
    membershipTypes,
    organizationStatuses,
    queryStatuses,
    resourceStatuses,
    resourceTypes,
    userRoles,
    userStatuses,
} from "../utils/constants";

/*
 * General guidelines to keep in mind when writing interfaces for models.
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

export interface IExternalListPage<T> {
    totalRecords: number;
    totalPages: number;
    previousPage: number;
    nextPage: number;
    hasPreviousPage: number;
    hasNextPage: number;
    records: T[];
}

export type ResourcePage = IExternalListPage<ExternalResource>;

export interface User {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    description: string;
    organizations: string[];
    gender: typeof genders[number];
    countryCode: typeof countryCodes[number];
    pictureURL: string;
    emailAddress: string;
    password: string;
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

export type UserPage = IExternalListPage<ExternalUser>;

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

export type GroupPage = IExternalListPage<ExternalGroup>;

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

export type AppPage = IExternalListPage<ExternalApp>;

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

    /*
     * An identifier that helps humans identify the organization across
     * Hypertool.
     */
    name: string;

    /* The display name of the organization. */
    title: string;

    /* A brief description of the organization. */
    description: string;

    /* The list of users that are part of the organization. */
    members: string[] | Membership[];

    /*
     * The status of the organization. Valid values are as follows: active,
     * deleted, banned.
     */
    status: typeof organizationStatuses[number];

    /* The list of apps that are part of the organization. */
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

export type OrganizationPage = IExternalListPage<ExternalOrganization>;

export interface Membership {
    id: string;
    /**
     * An identifier that points to the User whose membership is being
     * defined by the current document.
     */
    member: string | User;

    /**
     * An identifier that points to the User that invited the member to the
     * class specified by division.
     */
    inviter: string | User;

    /**
     * An identifier that points to the division.
     * This attribute is polymorphic, that is, its meaning is defined based
     * on the value of type attribute. For example, if type is organization,
     * then the identifier points to an organization document. On the other
     * hand, if type is group, then the identifier points to a group document.
     */
    division: string | Group | Organization;

    /**
     * The type of membership. Valid values are as follows: organization and
     * group.
     */
    type: typeof membershipTypes[number];

    /**
     * The status of the membership. Valid values are as follows: accepted,
     * deleted, banned, and invited.
     */
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

export interface Comment {
    /* An identifier that uniquely identifies the comment across Hypertool. */
    _id: string;

    /* An identifier that points to the User whose created the comment. */
    author: ObjectId | User;

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
    author: string | User;
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
    app: ObjectId | App;

    /* The name of the Page where the comment was created. */
    page: ObjectId | Page;

    /*
     * An object that describes the x and y coordinates of the conversation in
     * the canvas.
     */
    coordinates: Coordinates;

    /* A list of users who have participated in the conversation. */
    taggedUsers: [ObjectId | User];

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

export interface Page {
    _id: string;

    /* An identifier that points to the App where the comment was created. */
    app: ObjectId | App;

    /* The title of the page. */
    title: string;

    /* Optional description of the page. */
    description: string;

    /* The slug of the page. */
    slug: string;

    /* Specifies the timestamp that indicates when the page was created */
    createdAt: Date;

    /* Specifies the timestamp that indicates when the page was last modified */
    updatedAt: Date;
}

export interface ExternalPage {
    id: string;
    app: string;
    title: string;
    description: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export type PagePage = IExternalListPage<ExternalPage>;

export interface ExternalConversation {
    id: string;
    app: string;
    page: string;
    coordinates: Coordinates;
    taggedUsers: [string | User];
    comments: [string | Comment];
    status: typeof conversationStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type ConversationPage = IExternalListPage<ExternalConversation>;

export interface IControllerPatch {
    author: ObjectId | User;
    content: string;
    createdAt: Date;
}

export interface IController {
    _id?: ObjectId;
    creator: ObjectId | User;
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
    creator: string;
    patches: IExternalControllerPatch[];
    status: typeof controllerStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type TControllerPage = IExternalListPage<IExternalController>;

export type TToExternalFunction<T, E> = (internal: T) => E;

export type TGetByNameFunction = <T, E>(
    entity: string,
    model: Model<T>,
    toExternal: TToExternalFunction<T, E>,
    context: any,
    name: string,
) => Promise<E>;

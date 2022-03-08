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

export interface IMySQLConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

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
    mysql: IMySQLConfiguration | undefined;
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

export type ResourcePage = IExternalListPage<IExternalResource>;

export interface IUser {
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
    groups: string[] | IGroup[];
    role: typeof userRoles[number];
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
    organization: string;
    gender: typeof genders[number];
    countryCode: typeof countryCodes[number];
    pictureURL: string;
    emailAddress: string;
    emailVerified: boolean;
    groups: string[] | IGroup[];
    role: typeof userRoles[number];
    birthday: Date;
    status: typeof userStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type IUserPage = IExternalListPage<IExternalUser>;

export interface IGroup {
    _id: ObjectId;
    name: string;
    type: typeof groupTypes[number];
    description: string;
    users: string[] | IUser[];
    apps: string[] | IApp[];
    status: typeof groupStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalGroup {
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

export type TGroupPage = IExternalListPage<IExternalGroup>;

export interface IApp {
    _id: ObjectId;
    name: string;
    title: string;
    slug: string;
    description: string;
    organization: string | IOrganization;
    deployments: ObjectId[] | IDeployment[];
    groups: string[] | IGroup[];
    resources: string[] | IResource[];
    creator: string[] | IUser;
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
    groups: string[];
    creator: string;
    status: typeof appStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface ISession {
    jwtToken: string;
    user: IExternalUser;
    createdAt: Date;
}

export interface IQuery {
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

export interface IExternalQuery {
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

export type TAppPage = IExternalListPage<IExternalApp>;

export type TQueryPage = IExternalListPage<IExternalQuery>;

export interface IContext {
    type?: string;
    [x: string]: any;
}
export interface IActivityLog {
    _id: ObjectId;
    component: typeof componentOrigins[number];
    context: IContext;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalActivityLog {
    id: string;
    component: typeof componentOrigins[number];
    context: IContext;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TActivityLogPage = IExternalListPage<IExternalActivityLog>;

interface IManifestValues {
    [key: string]: any;
}

export interface IManifest {
    queries: IQuery[];
    resources: IResource[];
    app: IApp;
    file?: string;
    values?: IManifestValues;
}

export interface IDeployment {
    _id: ObjectId;
    app: ObjectId | IApp;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOrganization {
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
    members: string[] | IMembership[];

    /*
     * The status of the organization. Valid values are as follows: active,
     * deleted, banned.
     */
    status: typeof organizationStatuses[number];

    /* The list of apps that are part of the organization. */
    apps: string[] | IApp[];

    createdAt: Date;
    updatedAt: Date;
}

export interface IExternalDeployment {
    id: string;
    app: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IExternalOrganization {
    id: string;
    name: string;
    title: string;
    description: string;
    members: string[] | IMembership[];
    status: typeof organizationStatuses[number];
    apps: string[] | IApp[];
    createdAt: Date;
    updatedAt: Date;
}

export type TOrganizationPage = IExternalListPage<IExternalOrganization>;

export interface IMembership {
    id: string;
    /**
     * An identifier that points to the User whose membership is being
     * defined by the current document.
     */
    member: string | IUser;

    /**
     * An identifier that points to the User that invited the member to the
     * class specified by division.
     */
    inviter: string | IUser;

    /**
     * An identifier that points to the division.
     * This attribute is polymorphic, that is, its meaning is defined based
     * on the value of type attribute. For example, if type is organization,
     * then the identifier points to an organization document. On the other
     * hand, if type is group, then the identifier points to a group document.
     */
    division: string | IGroup | IOrganization;

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

export interface IExternalMembership {
    id: string;
    member: string | IUser;
    inviter: string | IUser;
    division: string | IGroup | IOrganization;
    type: typeof membershipTypes[number];
    status: typeof membershipStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
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
    conversation: ObjectId | IConversation;

    /* Specifies the timestamp that indicates when the comment was created.  */
    createdAt: Date;

    /* Specifies the timestamp that indicates when the comment was last modified. */
    updatedAt: Date;
}

export interface IExternalComment {
    id: string;
    author: string | IUser;
    content: string;
    edited: boolean;
    status: typeof commentStatuses[number];
    conversation: string | IConversation;
    createdAt: Date;
    updatedAt: Date;
}

export type TCommentPage = IExternalListPage<IExternalComment>;

export interface ICoordinates {
    x: number;
    y: number;
}

export interface IConversation {
    /* An identifier uniquely identifies the conversation across Hypertool. */
    _id: string;

    /* An identifier that points to the App where the comment was created. */
    app: ObjectId | IApp;

    /* The name of the Page where the comment was created. */
    page: ObjectId | IPage;

    /*
     * An object that describes the x and y coordinates of the conversation in
     * the canvas.
     */
    coordinates: ICoordinates;

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

export interface IPage {
    _id: string;

    /* An identifier that points to the App where the comment was created. */
    app: ObjectId | IApp;

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

export interface IExternalPage {
    id: string;
    app: string;
    title: string;
    description: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TPagePage = IExternalListPage<IExternalPage>;

export interface IExternalConversation {
    id: string;
    app: string;
    page: string;
    coordinates: ICoordinates;
    taggedUsers: [string | IUser];
    comments: [string | Comment];
    status: typeof conversationStatuses[number];
    createdAt: Date;
    updatedAt: Date;
}

export type TConversationPage = IExternalListPage<IExternalConversation>;

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

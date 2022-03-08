import { constants } from "@hypertool/common";

import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

import {
    activityLogs,
    apps,
    comments,
    controllers,
    conversations,
    deployments,
    groups,
    memberships,
    organizations,
    pages,
    queries,
    queryTemplates,
    resources,
    users,
} from "../controllers";
import { jwtAuth } from "../middleware";

import { types } from "./typeDefinitions";

const {
    resourceTypes,
    resourceStatuses,
    organizationStatuses,
    groupTypes,
    groupStatuses,
    queryStatuses,
    componentOrigins,
    queryResultFormats,
    membershipTypes,
    membershipStatuses,
    commentStatuses,
    conversationStatuses,
    controllerStatuses,
    controllerLanguages,
} = constants;

const typeDefs0 = `
    scalar GraphQLJSON

    ${types}

    type UserPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [User!]!
    }

    enum OrganizationStatus {
        ${organizationStatuses.join("\n")}
    }

    type Organization {
        id: ID!
        name: String!
        description: String!
        users: [User!]!
        status: OrganizationStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type OrganizationPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Organization!]!
    }

    enum ResourceType {
        ${resourceTypes.join("\n")}
    }

    enum ResourceStatus {
        ${resourceStatuses.join("\n")}
    }

    input MySQLConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input PostgresConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input MongoDBConfigurationInput {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    input BigQueryConfigurationInput {
        key: String!
    }

    input GoogleAuthInput {
        enabled: Boolean!
        clientId: String!
        secret: String!
    }

    input AuthServicesInput {
        googleAuth: GoogleAuthInput
    }

    input CoordinatesInput {
        x: Int!
        y: Int!
    }

    type GoogleAuth {
        enabled: Boolean!
        clientId: String!
        secret: String!
    }

    type AuthServices {
        googleAuth: GoogleAuth
    }

    type MySQLConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type PostgresConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type MongoDBConfiguration {
        host: String!
        port: Int!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type BigQueryConfiguration {
        key: String!
    }

    type Resource {
        id: ID!
        name: String!
        description: String!
        creator: User!
        type: ResourceType!
        status: ResourceStatus!
        mysql: MySQLConfiguration
        postgres: PostgresConfiguration
        mongodb: MongoDBConfiguration
        bigquery: BigQueryConfiguration
        createdAt: Date!
        updatedAt: Date!
    }

    type ResourcePage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Resource!]!
    }

    enum QueryResultFormats {
        ${queryResultFormats.join("\n")}
    }

    # TODO: Add slug, title
    type App {
        id: ID!
        name: String!
        title: String!
        slug: String!
        description: String!
        # Group points to App directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        groups: [ID!]!
        # Resource points to App directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        resources: [ID!]!
        # User points to App indirectly via groups attribute. Since groups is flattened
        # in User, we can use an aggregate type here.
        creator: User!
        status: AppStatus!
        createdAt: Date!
        updatedAt: Date!
        authServices: AuthServices
    }

    type AppPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [App!]!
    }

    enum GroupType {
        ${groupTypes.join("\n")}
    }

    enum GroupStatus {
        ${groupStatuses.join("\n")}
    }

    enum QueryStatus {
        ${queryStatuses.join("\n")}
    }

    type Group {
        id: ID!
        name: String!
        description: String!
        type: GroupType!
        users: [User!]!
        apps: [App!]!
        status: GroupStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type GroupPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Group!]!
    }

    type QueryTemplate {
        id: ID!
        name: String!
        description: String!
        # Resource does not point to QueryTemplate directly, making each other not mutually 
        # recursive. Therefore, we don't have to flatten the data structure here.
        resource: Resource!
        # App points to QueryTemplate directly, making each other mutually recursive. But since 
        # queries is flattened in App, we can use the aggregate type here.         
        app: App!
        content: String!
        status: QueryStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type QueryTemplatePage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [QueryTemplate!]!
    }

    type RemoveResult {
        success: Boolean!
    }

    enum ComponentOrigin {
        ${componentOrigins.join("\n")}
    }

    type ActivityLog {
        id: ID!
        message: String!
        component: ComponentOrigin!
        context: GraphQLJSON
        createdAt: Date!
        updatedAt: Date!
    }

    type ActivityLogPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [ActivityLog!]!
    }

    type QueryResult {
        result: GraphQLJSON,
        error: GraphQLJSON,
    }

    type Deployment {
        id: ID!
        app: App!
        createdAt: Date!
        updatedAt: Date!
    }

    type GenerateSignedURLsResult {
        signedURLs: [String!]!
        deployment: Deployment!
    }

    enum MembershipTypes {
        ${membershipTypes.join("\n")}
    }

    enum MembershipStatuses {
        ${membershipStatuses.join("\n")}
    }

    type Membership {
        id: ID!
        member: User!
        inviter: User!
        division: ID!
        type: MembershipTypes!
        status: MembershipStatuses!
        createdAt: Date!
        updatedAt: Date!
    }

    enum CommentStatuses {
        ${commentStatuses.join("\n")}
    }

    enum ConversationStatuses {
        ${conversationStatuses.join("\n")}
    }   

    type Comment {
        id: ID!
        author: ID!
        content: String!
        edited: Boolean!
        status: CommentStatuses!
        conversation: ID!
    }

    type CommentPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Comment!]!
    }

    type Coordinates {
        x: Int!
        y: Int!
    }

    type Conversation {
        id: ID!
        app: ID!
        page: ID!
        coordinates: Coordinates!
        taggedUsers: [ID!]!
        comments: [ID!]!
        status: ConversationStatuses!
    }

    type ConversationPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Conversation!]!
    }

    type Page {
        id: ID!
        app: String!
        title: String!
        description: String
        slug: String!
    }

    type PagePage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Page!]!
    }

    enum ControllerStatus {
        ${controllerStatuses.join("\n")}
    }

    enum ControllerLanguage {
        ${controllerLanguages.join("\n")}
    }

    type ControllerPatch {
        author: User!
        content: String!
        createdAt: Date!
    }

    type Controller {
        id: ID!
        name: String!
        description: String!
        language: ControllerLanguage!
        creator: User!
        patches: [ControllerPatch!]!
        status: ControllerStatus!
        createdAt: Date!
        updatedAt: Date!
    }

    type ControllerPage {
        totalRecords: Int!
        totalPages: Int!
        previousPage: Int!
        nextPage: Int!
        hasPreviousPage: Int!
        hasNextPage: Int!
        records: [Controller!]!
    }

    input ControllerPatchInput {
        author: ID!
        content: String!
    }

    type Mutation {
        createOrganization(
            name: String
            description: String
            users: [ID!]
        ): Organization!

        updateOrganization(
            organizationId: ID!
            name: String
            description: String
            users: [ID!]
        ): Organization!

        deleteOrganization(organizationId: ID!): RemoveResult!

        createUser(
            firstName: String!
            lastName: String!
            description: String
            organization: ID
            gender: Gender
            countryCode: Country
            pictureURL: String
            emailAddress: String!
            birthday: Date,
            role: UserRole,
            groups: [ID!]
        ): User!

        updateUser(
            userId: ID!
            firstName: String,
            lastName: String,
            description: String,
            organization: ID,
            gender: Gender,
            countryCode: Country,
            pictureURL: String,
            birthday: Date,
            role: UserRole,
            groups: [ID!]
        ): User!

        updatePassword(
            oldPassword: String!
            newPassword: String!
        ): User!

        deleteUser(userId: ID!): RemoveResult!

        createGroup(
            name: String
            description: String
            users: [ID!]
            apps: [ID!]
        ): Group!

        updateGroup(
            groupId: ID!
            name: String
            description: String
            users: [ID!]
            apps: [ID!]
        ): Group!

        deleteGroup(groupId: ID!): RemoveResult!

        createApp(
            name: String!
            title: String!
            slug: String!
            description: String
            groups: [ID!]
        ): App!

        updateApp(
            appId: ID!
            name: String
            title: String
            slug: String
            description: String
            groups: [ID!]
            authServices: AuthServicesInput
        ): App!

        deleteApp(appId: ID!): RemoveResult!

        createResource(
            name: String!
            description: String
            type: ResourceType!
            mysql: MySQLConfigurationInput
            postgres: PostgresConfigurationInput
            mongodb: MongoDBConfigurationInput
            bigquery: BigQueryConfigurationInput
        ): Resource!

        updateResource(
            resourceId: ID!
            name: String
            description: String
            mysql: MySQLConfigurationInput
            postgres: PostgresConfigurationInput
            mongodb: MongoDBConfigurationInput
            bigquery: BigQueryConfigurationInput
        ): Resource!

        deleteResource(resourceId: ID!): RemoveResult!

        createQueryTemplate(
            name: String!
            description: String
            resource: ID!
            app: ID!
            content: String!
        ): QueryTemplate!

        updateQueryTemplate(
            queryTemplateId: ID!
            name: String
            description: String
            content: String
        ): QueryTemplate!

        deleteQueryTemplate(queryTemplateId: ID!): RemoveResult!

        deleteAllStaticQueryTemplates(appId: ID!): RemoveResult!

        generateSignedURLs(appId: ID!, files: [String!]!): GenerateSignedURLsResult!

        createActivityLog(
            message: String!
            context: GraphQLJSON
            component: ComponentOrigin!
        ): ActivityLog!    

        createMembership(
            emailAddress: String!,
            organizationId: ID!
            inviterId: ID!
        ): Membership!

        createComment(
            author: ID!,
            content: String!
            conversation: ID!
        ): Comment!

        updateComment(
            commentId: String!
            content: String!
        ): Comment!

        deleteComment(commentId: String!): RemoveResult!

        createConversation(
            app: ID!
            page: ID!
            coordinates: CoordinatesInput!
            user: ID!
            comment: String!
        ): Conversation!

        updateConversation(
            conversationId: String!
            coordinates: CoordinatesInput!
        ): Conversation!

        deleteConversation(conversationId: String!): Conversation!
        
        resolveConversation(conversationId: String!): Conversation!

        unresolveConversation(conversationId: String!): Conversation!

        createPage(
            app: ID!
            title: String!
            slug: String
            description: String
        ): Page!

        updatePage(
            pageId: String!
            title: String!
            slug: String!
            description: String
        ): Page!

        createController(
            name: String!
            description: String!
            language: ControllerLanguage!
            patches: [ControllerPatchInput!]!
        ): Controller!

        updateController(
            controllerId: ID!
            patches: [ControllerPatchInput!]!
        ): Controller!
    }

    type Query {
        getOrganizations(page: Int, limit: Int): OrganizationPage!
        getOrganizationById(organizationId: ID!): Organization!

        getUsers(page: Int, limit: Int): UserPage!
        getUserById(userId: ID!): User!

        getGroups(page: Int, limit: Int): GroupPage!
        getGroupById(groupId: ID!): Group!

        getApps(page: Int, limit: Int): AppPage!
        getAppById(appId: ID!): App!
        getAppByName(name: String!): App!

        getResources(page: Int, limit: Int): ResourcePage!
        getResourceById(resourceId: ID!): Resource!
        getResourceByName(name: String!): Resource!

        getQueryTemplates(app: ID!, page: Int, limit: Int): QueryTemplatePage!
        getQueryTemplateById(queryTemplateId: ID!): QueryTemplate!
        getQueryTemplateByName(name: String!): QueryTemplate!

        getActivityLogs(page: Int, limit: Int): ActivityLogPage!
        getActivityLogById(activityLogId: ID!): ActivityLog!

        getQueryResult(name: String!, variables: GraphQLJSON!, format: QueryResultFormats!): QueryResult!

        listComments(page: Int, limit: Int): CommentPage!
        listCommentsById(commentIds: [ID!]!): [Comment]!

        listConversations(page: Int, limit: Int): ConversationPage!
        listConversationsById(conversationIds: [ID!]!): [Conversation]!

        listPages(app: ID!, page: Int, limit: Int): PagePage!
        listPagesById(appId: ID!, pageIds: [ID!]!): [Page]!

        getControllers(page: Int, limit: Int): ControllerPage!
        getControllersById(controllerIds: [ID!]): [Controller!]!
        getControllerByName(name: String!): Controller!
        getControllerById(controllerId: ID!): Controller!
    }
`;

const typeDefs = gql(typeDefs0);

const resolvers = {
    Date: new GraphQLScalarType({
        name: "Date",
        parseValue(value: string) {
            return new Date(value);
        },
        serialize(value: Date) {
            return value.toISOString();
        },
    }),
    Mutation: {
        createOrganization: async (parent, values, context) =>
            organizations.create(context.request, values),

        updateOrganization: async (parent, values, context) =>
            organizations.update(
                context.request,
                values.organizationId,
                values,
            ),

        deleteOrganization: async (parent, values, context) =>
            organizations.remove(context.request, context.organizationId),

        createUser: async (parent, values, context) =>
            users.create(context.request, values),

        updateUser: async (parent, values, context) =>
            users.update(context.request, values.userId, values),

        deleteUser: async (parent, values, context) =>
            users.remove(context.request, context.userId),

        updatePassword: async (parent, values, context) =>
            users.updatePassword(context.request, values),

        createGroup: async (parent, values, context) =>
            groups.create(context.request, values),

        updateGroup: async (parent, values, context) =>
            groups.update(context.request, values.groupId, values),

        deleteGroup: async (parent, values, context) =>
            groups.remove(context.request, context.groupId),

        createApp: async (parent, values, context) =>
            apps.create(context.request, values),

        updateApp: async (parent, values, context) =>
            apps.update(context.request, values.appId, values),

        deleteApp: async (parent, values, context) =>
            apps.remove(context.request, context.appId),

        createResource: async (parent, values, context) =>
            resources.create(context.request, values),

        updateResource: async (parent, values, context) =>
            resources.update(context.request, values.resourceId, values),

        deleteResource: async (parent, values, context) =>
            resources.remove(context.request, context.resourceId),

        createQueryTemplate: async (parent, values, context) =>
            queryTemplates.create(context.request, values),

        updateQueryTemplate: async (parent, values, context) =>
            queryTemplates.update(
                context.request,
                values.queryTemplateId,
                values,
            ),

        deleteQueryTemplate: async (parent, values, context) =>
            queryTemplates.remove(context.request, context.queryTemplateId),

        generateSignedURLs: async (parent, values, context) =>
            deployments.generateSignedURLs(context.request, values),

        createActivityLog: async (parent, values, context) =>
            activityLogs.create(context.request, values),

        createMembership: async (parent, values, context) =>
            memberships.create(context.request, values),

        createComment: async (parent, values, context) =>
            comments.create(context.request, values),

        updateComment: async (parent, values, context) =>
            comments.update(context.request, values.commentId, values),

        deleteComment: async (parent, values, context) =>
            comments.remove(context.request, values.commentId),

        createConversation: async (parent, values, context) =>
            conversations.create(context.request, values),

        updateConversation: async (parent, values, context) =>
            conversations.update(
                context.request,
                values.conversationId,
                values,
            ),

        deleteConversation: async (parent, values, context) =>
            conversations.changeStatus(
                context.request,
                values.conversationId,
                "deleted",
                ["deleted"],
            ),

        resolveConversation: async (parent, values, context) =>
            conversations.changeStatus(
                context.request,
                values.conversationId,
                "resolved",
                ["resolved", "deleted"],
            ),

        unresolveConversation: async (parent, values, context) =>
            conversations.changeStatus(
                context.request,
                values.conversationId,
                "pending",
                ["pending", "deleted"],
            ),

        createPage: async (parent, values, context) =>
            pages.create(context.request, values),

        updatePage: async (parent, values, context) =>
            pages.update(context.request, values.pageId, values),

        createController: (parent, values, context) =>
            controllers.create(context.request, values),

        updateController: (parent, values, context) =>
            controllers.update(context.request, values.controllerId, values),
    },
    Query: {
        getOrganizations: async (parent, values, context) =>
            organizations.list(context.request, values),

        getOrganizationById: async (parent, values, context) =>
            organizations.getById(context.request, values.organizationId),

        getUsers: async (parent, values, context) =>
            users.list(context.request, values),

        getUserById: async (parent, values, context) =>
            users.getById(context.request, values.userId),

        getGroups: async (parent, values, context) =>
            groups.list(context.request, values),

        getGroupById: async (parent, values, context) =>
            groups.getById(context.request, values.groupId),

        getApps: async (parent, values, context) =>
            apps.list(context.request, values),

        getAppById: async (parent, values, context) =>
            apps.getById(context.request, values.appId),

        getAppByName: async (parent, values, context) =>
            apps.getByName(context.request, values.name),

        getResources: async (parent, values, context) =>
            resources.list(context.request, values),

        getResourceById: async (parent, values, context) =>
            resources.getById(context.request, values.resourceId),

        getResourceByName: async (parent, values, context) =>
            resources.getByName(context.request, values.name),

        getQueryTemplates: async (parent, values, context) =>
            queryTemplates.listByAppId(context.request, values),

        getQueryTemplateById: async (parent, values, context) =>
            queryTemplates.getById(context.request, values.queryTemplateId),

        getQueryTemplateByName: async (parent, values, context) =>
            queryTemplates.getByName(context.request, values.name),

        getActivityLogs: async (parent, values, context) =>
            activityLogs.list(context.request, values),

        getActivityLogById: async (parent, values, context) =>
            activityLogs.getById(context.request, values.activityLogId),

        getQueryResult: async (parent, values, context) =>
            queries.getQueryResult(context.request, values),

        listComments: async (parent, values, context) =>
            comments.list(context.request, values),

        listCommentsById: async (parent, values, context) =>
            comments.listById(context.request, values.commentIds),

        listConversations: async (parent, values, context) =>
            conversations.list(context.request, values),

        listConversationsById: async (parent, values, context) =>
            conversations.listById(context.request, values.conversationIds),

        listPages: async (parent, values, context) =>
            pages.list(context.request, values),

        listPagesById: async (parent, values, context) =>
            pages.listById(context.request, values.appId, values.pageIds),

        getControllers: async (parent, values, context) =>
            controllers.list(context.request, values),

        getControllersById: async (parent, values, context) =>
            controllers.listByIds(context.request, values.controllerIds),

        getControllerByName: async (parent, values, context) =>
            controllers.getByName(context.request, values.name),

        getControllerById: async (parent, values, context) =>
            controllers.getById(context.request, values.controllerId),
    },
};

const attachRoutes = async (app: any) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: (context) => ({
            request: context.req,
        }),
    });
    await server.start();
    app.use("/graphql/v1/private", jwtAuth);
    server.applyMiddleware({
        app,
        path: "/graphql/v1/private",
    });
};

export { attachRoutes };

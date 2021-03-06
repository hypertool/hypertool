import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

import {
    activityLogs,
    apps,
    comments,
    controllers,
    conversations,
    deployments,
    organizations,
    queries,
    queryTemplates,
    resources,
    screens,
    teams,
    users,
} from "../controllers";
import { jwtAuth } from "../middleware";

import { types } from "./typeDefinitions";

const typeDefs = gql`
    ${types}

    type Mutation {
        createOrganization(
            name: String
            title: String
            description: String
        ): Organization!

        updateOrganization(
            organizationId: ID!
            name: String
            title: String
            description: String
            members: [OrganizationMemberInput!]
            apps: [ID!]
            teams: [ID!]
        ): Organization!

        deleteOrganization(organizationId: ID!): RemoveResult!

        createUser(
            firstName: String!
            lastName: String!
            description: String
            gender: Gender
            countryCode: Country
            pictureURL: String
            emailAddress: String!
            birthday: Date
            app: ID!
        ): User!

        updateUser(
            userId: ID!
            firstName: String
            lastName: String
            description: String
            organizations: [ID]
            gender: Gender
            countryCode: Country
            pictureURL: String
            birthday: Date
        ): User!

        updateEmailAddress(id: ID!, emailAddress: String!): User!

        updatePassword(oldPassword: String!, newPassword: String!): User!

        deleteUser(userId: ID!): RemoveResult!

        createTeam(
            name: String
            description: String
            organization: ID!
            members: [TeamMemberInput!]
            apps: [ID!]
        ): Team!

        updateTeam(
            name: String
            description: String
            organization: ID!
            members: [TeamMemberInput!]
            apps: [ID!]
        ): Team!

        deleteTeam(teamId: ID!): RemoveResult!

        createApp(
            name: String!
            title: String!
            description: String!
            organization: ID
        ): App!

        duplicateApp(
            sourceApp: ID!
            name: String!
            title: String!
            description: String
            organization: ID
        ): App!

        updateApp(
            appId: ID!
            name: String
            title: String
            slug: String
            description: String
            authServices: AuthServicesInput
        ): App!

        deleteApp(appId: ID!): RemoveResult!

        createResource(
            name: String!
            description: String
            type: ResourceType!
            app: ID!
            mysql: MySQLConfigurationInput
            postgres: PostgresConfigurationInput
            mongodb: MongoDBConfigurationInput
            bigquery: BigQueryConfigurationInput
        ): Resource!

        updateResource(
            resourceId: ID!
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
            content: String!
        ): QueryTemplate!

        updateQueryTemplate(
            queryTemplateId: ID!
            description: String
            content: String
        ): QueryTemplate!

        deleteQueryTemplate(queryTemplateId: ID!): RemoveResult!

        deleteAllStaticQueryTemplates(appId: ID!): RemoveResult!

        generateSignedURLs(
            appId: ID!
            files: [String!]!
        ): GenerateSignedURLsResult!

        createActivityLog(
            message: String!
            context: GraphQLJSON
            component: ComponentOrigin!
        ): ActivityLog!

        createComment(
            author: ID!
            content: String!
            conversation: ID!
        ): Comment!

        updateComment(commentId: String!, content: String!): Comment!

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

        createScreen(
            app: ID!
            name: String!
            title: String!
            slug: String
            content: String!
            description: String
        ): Screen!

        updateScreen(
            screenId: ID!
            title: String
            slug: String
            content: String
            description: String
        ): Screen!

        deleteScreen(screenId: ID!): RemoveResult!

        createController(
            name: String!
            description: String!
            language: ControllerLanguage!
            patches: [ControllerPatchInput!]!
            app: ID!
        ): Controller!

        updateController(
            controllerId: ID!
            patches: [ControllerPatchInput!]!
        ): Controller!

        updateControllerWithSource(
            controllerId: ID!
            source: String!
        ): Controller!

        deleteController(controllerId: ID!): RemoveResult!
    }

    type Query {
        getOrganizations(page: Int, limit: Int): OrganizationPage!
        getOrganizationById(organizationId: ID!): Organization!
        listOrganizationsByIds(organizationIds: [ID!]!): [Organization!]!

        getUsers(app: ID!, page: Int, limit: Int): UserPage!
        getUserById(userId: ID!): User!

        getTeams(page: Int, limit: Int): TeamPage!
        getTeamById(teamId: ID!): Team!

        getApps(page: Int, limit: Int): AppPage!
        getAppById(appId: ID!): App!
        getAppByName(name: String!): App!

        getResources(app: ID!, page: Int, limit: Int): ResourcePage!
        getResourceById(resourceId: ID!): Resource!
        getResourceByName(name: String!): Resource!

        getQueryTemplates(app: ID!, page: Int, limit: Int): QueryTemplatePage!
        getQueryTemplateById(queryTemplateId: ID!): QueryTemplate!
        getQueryTemplateByName(name: String!): QueryTemplate!

        getActivityLogs(page: Int, limit: Int): ActivityLogPage!
        getActivityLogById(activityLogId: ID!): ActivityLog!

        executeQuery(
            name: String!
            variables: GraphQLJSON!
            format: QueryResultFormat!
        ): QueryResult!

        listComments(page: Int, limit: Int): CommentPage!
        listCommentsById(commentIds: [ID!]!): [Comment]!

        listConversations(page: Int, limit: Int): ConversationPage!
        getConversationsByIds(conversationIds: [ID!]!): [Conversation]!

        getScreens(app: ID!, page: Int, limit: Int): ScreenPage!
        getScreensByIds(appId: ID!, screenIds: [ID!]!): [Screen!]!
        getScreenByName(name: String!): Screen!
        getScreenById(screenId: ID!): Screen!

        getControllers(app: ID!, page: Int, limit: Int): ControllerPage!
        getControllersById(controllerIds: [ID!]): [Controller!]!
        getControllerByName(name: String!): Controller!
        getControllerById(controllerId: ID!): Controller!
    }
`;

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
            organizations.remove(context.request, values.organizationId),

        createUser: async (parent, values, context) =>
            users.create(context.request, values),

        updateUser: async (parent, values, context) =>
            users.update(context.request, values.userId, values),

        deleteUser: async (parent, values, context) =>
            users.remove(context.request, values.userId),

        updateEmailAddress: async (parent, values, context) =>
            users.updateEmailAddress(context.request, values),

        updatePassword: async (parent, values, context) =>
            users.updatePassword(context.request, values),

        createTeam: async (parent, values, context) =>
            teams.create(context.request, values),

        updateTeam: async (parent, values, context) =>
            teams.update(context.request, values.teamId, values),

        deleteTeam: async (parent, values, context) =>
            teams.remove(context.request, values.teamId),

        createApp: async (parent, values, context) =>
            apps.create(context.request, values),

        duplicateApp: async (parent, values, context) =>
            apps.duplicate(context.request, values),

        updateApp: async (parent, values, context) =>
            apps.update(context.request, values.appId, values),

        deleteApp: async (parent, values, context) =>
            apps.remove(context.request, values.appId),

        createResource: async (parent, values, context) =>
            resources.create(context.request, values),

        updateResource: async (parent, values, context) =>
            resources.update(context.request, values.resourceId, values),

        deleteResource: async (parent, values, context) =>
            resources.remove(context.request, values.resourceId),

        createQueryTemplate: async (parent, values, context) =>
            queryTemplates.create(context.request, values),

        updateQueryTemplate: async (parent, values, context) =>
            queryTemplates.update(
                context.request,
                values.queryTemplateId,
                values,
            ),

        deleteQueryTemplate: async (parent, values, context) =>
            queryTemplates.remove(context.request, values.queryTemplateId),

        generateSignedURLs: async (parent, values, context) =>
            deployments.generateSignedURLs(context.request, values),

        createActivityLog: async (parent, values, context) =>
            activityLogs.create(context.request, values),

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

        createScreen: async (parent, values, context) =>
            screens.create(context.request, values),

        updateScreen: async (parent, values, context) =>
            screens.update(context.request, values.screenId, values),

        deleteScreen: async (parent, values, context) =>
            screens.remove(context.request, values.screenId),

        createController: (parent, values, context) =>
            controllers.create(context.request, values),

        updateController: (parent, values, context) =>
            controllers.update(context.request, values.controllerId, values),

        updateControllerWithSource: (parent, values, context) =>
            controllers.updateWithSource(
                context.request,
                values.controllerId,
                values,
            ),

        deleteController: (parent, values, context) =>
            controllers.remove(context.request, values.controllerId),
    },
    Query: {
        getOrganizations: async (parent, values, context) =>
            organizations.list(context.request, values),

        getOrganizationById: async (parent, values, context) =>
            organizations.getById(context.request, values.organizationId),

        listOrganizationsByIds: async (parent, values, context) =>
            organizations.listByIds(context.request, values.organizationIds),

        getUsers: async (parent, values, context) =>
            users.list(context.request, values),

        getUserById: async (parent, values, context) =>
            users.getById(context.request, values.userId),

        getTeams: async (parent, values, context) =>
            teams.list(context.request, values),

        getTeamById: async (parent, values, context) =>
            teams.getById(context.request, values.teamId),

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

        executeQuery: async (parent, values, context) =>
            queries.execute(context.request, values),

        listComments: async (parent, values, context) =>
            comments.list(context.request, values),

        listCommentsById: async (parent, values, context) =>
            comments.listByIds(context.request, values.commentIds),

        listConversations: async (parent, values, context) =>
            conversations.list(context.request, values),

        getConversationsByIds: async (parent, values, context) =>
            conversations.listByIds(context.request, values.conversationIds),

        getScreens: async (parent, values, context) =>
            screens.list(context.request, values),

        getScreensByIds: async (parent, values, context) =>
            screens.listByIds(context.request, values.screenIds),

        getScreenByName: async (parent, values, context) =>
            screens.getByName(context.request, values.name),

        getScreenById: async (parent, values, context) =>
            screens.getById(context.request, values.screenId),

        getControllers: async (parent, values, context) =>
            controllers.list(context.request, values),

        getControllersById: async (parent, values, context) =>
            controllers.listByIds(context.request, values.controllerIds),

        getControllerByName: async (parent, values, context) =>
            controllers.getByName(context.request, values.name),

        getControllerById: async (parent, values, context) =>
            controllers.getById(context.request, values.controllerId),
    },
    App: {
        resources: async (parent, values, context) =>
            resources.listByIds(context.request, values.resources),
        creator: async (parent, values, context) =>
            users.getById(context.request, parent.creator),
        /*
         * deployments: async (parent, values, context) =>
         *     deployments.listByIds(context.request, parent.deployments),
         */
    },
    User: {
        app: async (parent, values, context) =>
            apps.getById(context.request, parent.app),
        organizations: async (parent, values, context) =>
            organizations.listByIds(context.request, parent.organizations),
        apps: async (parent, values, context) =>
            apps.listByIds(context.request, parent.apps),
    },
    Comment: {
        author: async (parent, values, context) =>
            users.getById(context.request, parent.author),
        /*
         * conversation: async (parent, values, context) =>
         *     conversations.getById(context.request, parent.conversation),
         */
    },
    QueryTemplate: {
        resource: async (parent, values, context) =>
            resources.getById(context.request, parent.resource),
        app: async (parent, values, context) =>
            apps.getById(context.request, parent.app),
    },
    Controller: {
        creator: async (parent, values, context) =>
            users.getById(context.request, parent.creator),
    },
    ControllerPatch: {
        author: async (parent, values, context) =>
            users.getById(context.request, parent.author),
    },
    Deployment: {
        app: async (parent, values, context) =>
            apps.getById(context.request, parent.app),
    },
    Organization: {
        apps: async (parent, values, context) =>
            apps.listByIds(context.request, parent.apps),
        teams: async (parent, values, context) =>
            teams.listByIds(context.request, parent.teams),
    },
    Resource: {
        creator: async (parent, values, context) =>
            users.getById(context.request, parent.creator),
    },
    Screen: {
        app: async (parent, values, context) =>
            apps.getById(context.request, parent.app),
        controller: async (parent, values, context) =>
            controllers.getById(context.request, parent.controller),
        creator: async (parent, values, context) =>
            users.getById(context.request, parent.creator),
    },
    Team: {
        organization: async (parent, values, context) =>
            organizations.getById(context.request, parent.organization),
        apps: async (parent, values, context) =>
            apps.listByIds(context.request, parent.apps),
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

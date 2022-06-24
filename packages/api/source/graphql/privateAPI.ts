import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

import {
    activityLogs,
    apps,
    sourceFiles,
    deployments,
    organizations,
    queries,
    queryTemplates,
    resources,
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

        createSourceFile(
            name: String!
            directory: Boolean!
            content: String
            app: ID!
        ): SourceFile!

        updateSourceFile(
            sourceFileId: ID!
            name: String
            content: String
        ): SourceFile!

        updateSourceFileWithSource(
            sourceFileId: ID!
            source: String!
        ): SourceFile!

        deleteSourceFile(sourceFileId: ID!): RemoveResult!
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

        getSourceFiles(app: ID!, page: Int, limit: Int): SourceFilePage!
        getSourceFilesById(sourceFileIds: [ID!]): [SourceFile!]!
        getSourceFileByName(name: String!): SourceFile!
        getSourceFileById(sourceFileId: ID!): SourceFile!
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

        createSourceFile: (parent, values, context) =>
            sourceFiles.create(context.request, values),

        updateSourceFile: (parent, values, context) =>
            sourceFiles.update(context.request, values.sourceFileId, values),

        deleteSourceFile: (parent, values, context) =>
            sourceFiles.remove(context.request, values.sourceFileId),
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

        getSourceFiles: async (parent, values, context) =>
            sourceFiles.list(context.request, values),

        getSourceFilesById: async (parent, values, context) =>
            sourceFiles.listByIds(context.request, values.sourceFileIds),

        getSourceFileByName: async (parent, values, context) =>
            sourceFiles.getByName(context.request, values.name),

        getSourceFileById: async (parent, values, context) =>
            sourceFiles.getById(context.request, values.sourceFileId),
    },
    App: {
        resources: async (parent, values, context) =>
            resources.listByIds(context.request, parent.resources),
        queryTemplates: async (parent, values, context) =>
            queryTemplates.listByIds(context.request, parent.queryTemplates),
        sourceFiles: async (parent, values, context) =>
            sourceFiles.listByIds(context.request, parent.sourceFiles),
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
    QueryTemplate: {
        resource: async (parent, values, context) =>
            resources.getById(context.request, parent.resource),
        app: async (parent, values, context) =>
            apps.getById(context.request, parent.app),
    },
    SourceFile: {
        creator: async (parent, values, context) =>
            users.getById(context.request, parent.creator),
    },
    SourceFilePatch: {
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

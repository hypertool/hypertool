import { ApolloServer, gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";
import {
    organizations,
    users,
    groups,
    apps,
    resources,
    queryTemplates,
    deployments,
    role,
} from "../controllers";
import { types } from "./typeDefinitions";
import { jwtAuth } from "../middleware";

import {
    resourceTypes,
    resourceStatuses,
    organizationStatuses,
    groupTypes,
    appStatuses,
    groupStatuses,
    queryStatuses,
} from "../utils/constants";

const typeDefs = gql`
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

    enum AppStatus {
        ${appStatuses.join("\n")}
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

    type RoleModel{
        name:String!
        priviledges:[String!]
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

        generateSignedURLs(files: [String!]!): [String!]!

        createRoleModel(name:String!,priviledges:String!):RoleModel!

        updateRoleModel(name:String!,priviledges:String!):RoleModel!
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

        getQueryTemplateByAppId(page: Int, limit: Int, app: ID!): QueryTemplatePage!
        getQueryTemplateById(queryTemplateId: ID!): QueryTemplate!
        getQueryTemplateByName(name: String!): QueryTemplate!

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
            organizations.remove(context.request, context.organizationId),

        createUser: async (parent, values, context) =>
            users.create(context.request, values),

        updateUser: async (parent, values, context) =>
            users.update(context.request, values.userId, values),

        deleteUser: async (parent, values, context) =>
            users.remove(context.request, context.userId),

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
            deployments.generateSignedURLs(context.request, values.files),

        createRoleModel: async (parent, values, context) =>
            role.create(context.request, values),

        updateRoleModel: async (parent, values, context) =>
            role.update(context.request, values.name, values),
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

        getQueryTemplateByAppId: async (parent, values, context) =>
            queryTemplates.listByAppId(context.request, values),

        getQueryTemplateById: async (parent, values, context) =>
            queryTemplates.getById(context.request, values.queryTemplateId),

        getQueryTemplateByName: async (parent, values, context) =>
            queryTemplates.getByName(context.request, values.name),
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

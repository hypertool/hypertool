import { constants } from "@hypertool/common";

import { ApolloServer, gql } from "apollo-server-express";

import { apps, queries, users } from "../controllers";

import { types } from "./typeDefinitions";

const { googleClientTypes } = constants;

const typeDefs = gql`
    ${types}

    type GoogleAuth {
        enabled: Boolean!
        clientId: String!
        secret: String!
    }

    type AuthServices {
        googleAuth: GoogleAuth
    }

    enum ClientType {
        ${googleClientTypes.join("\n")}
    }

    type PasswordResetResult {
        message: String!
        success: Boolean!
    }

    type Query {
        getAppByName(name: String!): App!
        getRootApp: App
    }

    type Mutation {
        loginWithGoogle(token: String!, client: ClientType!): Session!

        signupWithEmail(
            firstName: String!
            lastName: String!
            role: String
            emailAddress: String!
            password: String!
            app: ID!
        ): User!

        loginWithEmail(
            emailAddress: String!
            password: String!
        ): Session!

        requestPasswordReset(
            emailAddress: String!
            appId: ID!
        ): PasswordResetResult!

        completePasswordReset(
            token: String!
            newPassword: String!
        ): Session!

        executeQuery(
            name: String!
            variables: GraphQLJSON!
            format: QueryResultFormat!
        ): QueryResult!

        installHypertool(
            name: String!
            title: String!
            firstName: String!
            lastName: String!
            emailAddress: String!
            password: String!
        ): App!
    }
`;

const resolvers = {
    Query: {
        /* TODO: Fix critical bug that exposes resource credentials. */
        getAppByName: async (parent, values, context) =>
            apps.getByName(context.request, values.name),

        getRootApp: async (parent, values, context) =>
            apps.getRootApp(context.request),
    },
    Mutation: {
        loginWithGoogle: async (parent, values, context) =>
            users.loginWithGoogle(context.request, values.token, values.client),

        signupWithEmail: async (parent, values, context) =>
            users.signupWithEmail(context.request, values),

        loginWithEmail: async (parent, values, context) =>
            users.loginWithEmail(context.request, values),

        requestPasswordReset: async (parent, values, context) =>
            users.requestPasswordReset(context.request, values),

        completePasswordReset: async (parent, values, context) =>
            users.completePasswordReset(context.request, values),

        executeQuery: async (parent, values, context) =>
            queries.execute(context.request, values),

        installHypertool: async (parent, values, context) =>
            apps.install(context.request, values),
    },
};

const attachRoutes = async (app) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: (context) => ({
            request: context.req,
        }),
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql/v1/public" });
};

export { attachRoutes };

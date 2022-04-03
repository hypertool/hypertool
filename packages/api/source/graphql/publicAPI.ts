import { constants } from "@hypertool/common";

import { ApolloServer, gql } from "apollo-server-express";

import { apps, controllers, screens, users } from "../controllers";

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
        dummy: String!

        getAppByName(name: String!): App!
    }

    type Mutation {
        loginWithGoogle(token: String!, client: ClientType!): Session!

        signupWithEmail(
            firstName: String!
            lastName: String!
            role: String
            emailAddress: String!
            password: String!
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
    }
`;

const resolvers = {
    App: {
        screens: async (parent, values, context) =>
            screens.listByIds(context.request, parent.screens),
    },
    Screen: {
        controller: async (parent, values, context) =>
            controllers.getById(context.request, parent.controller),
    },
    Query: {
        dummy: async () => "Hello",

        getAppByName: async (parent, values, context) =>
            apps.getByName(context.request, values.name),
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
    },
};

const attachRoutes = async (app) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql/v1/public" });
};

export { attachRoutes };

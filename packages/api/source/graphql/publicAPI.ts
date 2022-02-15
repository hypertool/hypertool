import { ApolloServer, gql } from "apollo-server-express";

import { constants } from "@hypertool/common";

import { types } from "./typeDefinitions";
import { users, apps } from "../controllers";
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

    enum ClientType {
        ${googleClientTypes.join("\n")}
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

        updatePassword(
            emailAddress: String!
            newPassword: String!
            newPassword: String!
        ): User!
    }
`;

const resolvers = {
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

        updatePassword: async (parent, values, context) =>
            users.updatePassword(context.request, values),
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

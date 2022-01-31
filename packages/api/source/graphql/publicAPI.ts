import { ApolloServer, gql } from "apollo-server-express";

import { constants } from "@hypertool/common";

import { types } from "./typeDefinitions";
import { users, apps } from "../controllers";
const { googleClientTypes } = constants;

const typeDefs = gql`
    ${types}

    type Query {
        dummy: String!

        getAppByName(name: String!): App!
    }

    enum ClientType {
        ${googleClientTypes.join("\n")}
    }

    type Mutation {
        loginWithGoogle(token: String!, client: ClientType!): Session!
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

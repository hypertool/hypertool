const { ApolloServer, gql } = require("apollo-server-express");

const types = require("./typeDefinitions");
const {
    users,
} = require("../controllers");

const typeDefs = gql`
    ${types}
`;

const resolvers = {
    Users: {
        login: async (parent, values, context) =>
            users.loginWithGoogle(context.request, parent.creator),
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

module.exports = { attachRoutes };
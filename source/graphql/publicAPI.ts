const { ApolloServer, gql } = require("apollo-server-express");

const types = require("./typeDefinitions");
const {
    users,
} = require("../controllers");

const typeDefs = gql`
    ${types}

    type Mutation {
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
    }

    type Query {
        getOrganizations(page: Int, limit: Int): OrganizationPage!
        getOrganizationById(organizationId: ID!): Organization!
    }
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
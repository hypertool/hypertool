import { ApolloServer, gql } from "apollo-server-express";

import {
  resourceTypes,
  resourceStatuses,
  genders,
  countryCodes,
  userStatuses,
} from "../utils/constants";

const typeDefs = gql`
    enum ResourceType {
        ${resourceTypes.join("\n")}
    }

    enum ResourceStatus {
        ${resourceStatuses.join("\n")}
    }

    enum Gender {
        ${genders.join("\n")}
    }

    enum Country {
        ${countryCodes.join("\n")}
    }

    enum UserStatus {
        ${userStatuses.join("\n")}
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        description: String!
        gender: Gender
        countryCode: Country
        pictureURL: String
        emailAddress: String!
        emailVerified: Boolean!
        permissions: [String!]!
        birthday: String
        status: UserStatus!
    }
`;

const resolvers = {};

const attachRoutes = async (app: any) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (context) => ({
      request: context.req,
    }),
  });
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql/v1/private",
  });
};

export { attachRoutes };

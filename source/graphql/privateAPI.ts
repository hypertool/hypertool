import { ApolloServer, gql } from "apollo-server-express";

import {
  resourceTypes,
  resourceStatuses,
  genders,
  countryCodes,
  userStatuses,
  organizationStatuses,
  userRoles,
} from "../utils/constants";

const typeDefs = gql`
    enum Gender {
        ${genders.join("\n")}
    }

    enum Country {
        ${countryCodes.join("\n")}
    }

    enum UserStatus {
        ${userStatuses.join("\n")}
    }

    enum UserRole {
        ${userRoles.join("\n")}
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        description: String!
        # Organization points to User directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        organization: ID!
        gender: Gender
        countryCode: Country
        pictureURL: String
        emailAddress: String!
        emailVerified: Boolean!
        birthday: String
        status: UserStatus!
        role: UserRole!
        # Group points to User directly, making each other mutually recursive.
        # Therefore, we flatten the data structure here.
        groups: [ID!]!
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
    }

    enum ResourceType {
        ${resourceTypes.join("\n")}
    }

    enum ResourceStatus {
        ${resourceStatuses.join("\n")}
    }

    type MySQLConfiguration {
        host: String!
        post: Integer!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type PostgresConfiguration {
        host: String!
        post: Integer!
        databaseName: String!
        databaseUserName: String!
        databasePassword: String!
        connectUsingSSL: Boolean!
    }

    type MongoDBConfiguration {
        host: String!
        post: Integer!
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

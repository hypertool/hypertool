import { ApolloServer, gql } from "apollo-server-express";

import { resourceTypes, resourceStatuses } from "../utils/constants";

const typeDefs = gql`
    enum ResourceType {
        ${resourceTypes.join("\n")}
    }

    enum ResourceStatus {
        ${resourceStatuses.join("\n")}
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

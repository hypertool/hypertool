import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { IApp } from "../types";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_URL}/graphql/v1/public`,
  cache: new InMemoryCache(),
});

const GET_APP = gql`
  query GetApp($name: String!) {
    getAppByName(name: $name) {
      id
      name
      title
      description
      status
      createdAt
      updatedAt
      screens {
        id
        name
        title
        description
        slug
        content
        controller {
          id
          name
          description
          language
          patched
          status
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
      }
    }
  }
`;

const publicDomainSuffix = ".hypertool.io";

const useFetchApp = (): IApp | null => {
  const [app, setApp] = useState<IApp | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const hostName = window.location.hostname;
      if (!hostName.endsWith(publicDomainSuffix)) {
        throw new Error("Custom domains are not supported.");
      }

      const appName = hostName.substring(
        0,
        hostName.length - publicDomainSuffix.length
      );
      const result = await client.query({
        query: GET_APP,
        variables: {
          name: appName,
        },
      });
      if (mounted) {
        setApp(result.data.getAppByName);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return app;
};

export default useFetchApp;

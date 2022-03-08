import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

import fetch from "cross-fetch";

import type { ISession } from "../types";

import Client from "./client";

const createPrivateClient = (session: ISession) => {
    const httpLink = new HttpLink({
        uri: `http://localhost:3001/graphql/v1/private`,
        fetch,
    });
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${session.jwtToken}`,
            },
        };
    });
    return new Client(
        new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache(),
        }),
    );
};

export { createPrivateClient };

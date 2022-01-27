import fetch from "cross-fetch";
import {
    gql,
    ApolloClient,
    InMemoryCache,
    HttpLink,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

import type { Session } from "../types";

import Client from "./client";

const LOGIN_WITH_GOOGLE = gql`
    mutation LoginWithGoogle($token: String!, $client: ClientType!) {
        loginWithGoogle(token: $token, client: $client) {
            jwtToken
            user {
                id
                firstName
                lastName
                description
                gender
                countryCode
                pictureURL
                emailAddress
                emailVerified
                birthday
                status
                createdAt
                updatedAt
            }
            createdAt
        }
    }
`;

const client = new ApolloClient({
    link: new HttpLink({
        uri: `http://localhost:3001/graphql/v1/public`,
        fetch,
    }),
    cache: new InMemoryCache(),
});

/**
 * The `createSession` accepts an authorization token fetched from Google.
 * It creates a session by making a GraphQL call to our API. The session
 * object is then returned after deleting unnecessary keys.
 *
 * @param token
 * The authorization token retrieved from Google.
 * @returns
 * The session object after deleting unnecessary keys.
 */
const createSession = async (token: string): Promise<Session> => {
    const {
        data: { loginWithGoogle: session },
    } = await client.mutate({
        mutation: LOGIN_WITH_GOOGLE,
        variables: { token, client: "cli" },
    });
    delete session.__typename;
    delete session.user.__typename;
    return session;
};

const createPrivateClient = (session: Session) => {
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

export { createSession, createPrivateClient };

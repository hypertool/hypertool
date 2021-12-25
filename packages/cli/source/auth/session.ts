import fetch from "cross-fetch";
import { gql, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import chalk from "chalk";
import fs from "fs-extra";
import os from "os";
import path from "path";

import { startServer } from "./server";
import { logger } from "../utils";

const HOME_DIRECTORY = os.homedir();
const SESSION_DESCRIPTOR = path.join(
    HOME_DIRECTORY,
    ".hypertool",
    "session.json",
);

const LOGIN_WITH_GOOGLE = gql`
    mutation LoginWithGoogle($token: String!) {
        loginWithGoogle(token: $token) {
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
const createSession = async (token: string) => {
    const {
        data: { loginWithGoogle: session },
    } = await client.mutate({
        mutation: LOGIN_WITH_GOOGLE,
        variables: { token },
    });
    delete session.__typename;
    delete session.user.__typename;
    return session;
};

export const authenticate = async () => {
    const authorizationToken = await startServer();
    const session = await createSession(authorizationToken);

    logger.info(`Hi, ${session.user.firstName}!`);
    logger.info(
        `You have authenticated as ${chalk.blue.bold(
            session.user.emailAddress,
        )}.`,
    );
    await fs.outputFile(SESSION_DESCRIPTOR, JSON.stringify(session, null, 4));
};

export const loadSession = async () => {
    const session = await fs.readJSON(SESSION_DESCRIPTOR, {
        throws: false,
    });
    if (!session) {
        throw new Error(
            "You are not authenticated. Run `hypertool auth` to before continuing.",
        );
    }
    return session;
};

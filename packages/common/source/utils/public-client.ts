import type { Session } from "../types";

import { googleClientTypes } from "./constants";
import {
    gql,
    ApolloClient,
    InMemoryCache,
    HttpLink,
} from "@apollo/client/core";
import { OAuth2Client } from "google-auth-library";

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

const GET_GOOGLE_AUTH_SERVICES = gql`
    query GetAppByName($name: String) {
        getAppByName(name: $name) {
            authServices {
                googleAuth {
                    clientId
                    secret
                }
            }
        }
    }
`;

export default class PublicClient {
    appIdentifier: string;
    client: ApolloClient<any>;

    constructor(appIdentifier: string) {
        this.appIdentifier = appIdentifier;
        this.client = new ApolloClient({
            link: new HttpLink({
                uri: `http://localhost:3001/graphql/v1/public`,
                fetch,
            }),
            cache: new InMemoryCache(),
        });
    }

    loginWithGoogle = async (
        token: string,
        client: typeof googleClientTypes[number],
    ): Promise<Session> => {
        const {
            data: { loginWithGoogle: session },
        } = await this.client.mutate({
            mutation: LOGIN_WITH_GOOGLE,
            variables: { token, client },
        });
        delete session.__typename;
        delete session.user.__typename;
        return session;
    };

    getGoogleAuthServices = async (
        name: string,
        code: string,
    ): Promise<any> => {
        try {
            const { data } = await this.client.query({
                query: GET_GOOGLE_AUTH_SERVICES,
                variables: { name },
            });

            const clientId = data.getAppByName.authServices.googleAuth.clientId;
            const secret = data.getAppByName.authServices.googleAuth.secret;

            const googleClient = new OAuth2Client({
                clientId: clientId,
                clientSecret: secret,
            });

            const credentials = await googleClient.getToken(code);

            return credentials.tokens.access_token;
        } catch (error) {
            return null;
        }
    };
}

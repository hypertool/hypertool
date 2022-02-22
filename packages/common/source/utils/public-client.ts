import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    gql,
} from "@apollo/client/core";

import type { Session } from "../types";

import { googleClientTypes } from "./constants";

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

const GET_AUTH_SERVICES = gql`
    query GetAppByName($name: String) {
        getAppByName(name: $name) {
            authServices {
                googleAuth {
                    clientId
                }
            }
        }
    }
`;

const CREATE_ACCOUNT = gql`
    mutation SignUpWithEmail(
        $firstName: String!
        $lastName: String!
        $role: String
        $emailAddress: String!
        $password: String!
    ) {
        signupWithEmail(
            firstName: $firstName
            lastName: $lastName
            role: $role
            emailAddress: $emailAddress
            password: $password
        ) {
            id
        }
    }
`;

const COMPLETE_PASSWORD_RESET = gql`
    mutation CompletePasswordReset($token: String!, $newPassword: String!) {
        completePasswordReset(token: $emailAddress, newPassword: $password) {
            jwtToken
            user {
                id
            }
            createdAt
        }
    }
`;

export default class PublicClient {
    appName: string;
    client: ApolloClient<any>;

    constructor(appName: string) {
        this.appName = appName;
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

    getAuthInfo = async (): Promise<any> => {
        try {
            const { data } = await this.client.query({
                query: GET_AUTH_SERVICES,
                variables: { name: this.appName },
            });
            const clientId = data.getAppByName.authServices.googleAuth.clientId;
            const authData = [
                {
                    type: "google-oauth",
                    payload: {
                        clientId,
                    },
                },
            ];
            return authData;
        } catch (error) {
            return null;
        }
    };

    createAccount = async ({
        firstName,
        lastName,
        role,
        emailAddress,
        password,
    }): Promise<any> => {
        await this.client.mutate({
            mutation: CREATE_ACCOUNT,
            variables: {
                firstName,
                lastName,
                role,
                emailAddress,
                password,
            },
        });
    };

    completePasswordReset = async ({
        token,
        newPassword,
    }): Promise<Session> => {
        const { data } = await this.client.mutate({
            mutation: COMPLETE_PASSWORD_RESET,
            variables: {
                token,
                newPassword,
            },
        });

        return data;
    };
}

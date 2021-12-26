import type { ApolloClient } from "@apollo/client";

import { gql, ApolloError } from "@apollo/client";

import type { Manifest, App } from "../types";

const GET_APP_BY_NAME = gql`
    query GetAppByName($name: String!) {
        getAppByName(name: $name) {
            id
            name
            description
            groups
            resources
            status
            createdAt
            updatedAt
        }
    }
`;

const CREATE_APP = gql`
    mutation CreateApp(
        $name: String!
        $title: String!
        $description: String
        $groups: [ID!]
        $resources: [ID!]
    ) {
        createApp(
            name: $name
            title: $title
            description: $description
            groups: $groups
            resources: $resources
        ) {
            id
        }
    }
`;

const CREATE_QUERY_TEMPLATE = gql`
    mutation CreateQueryTemplate(
        $name: String!
        $description: String
        $resource: ID!
        $app: ID!
        $content: String!
    ) {
        createQueryTemplate(
            name: $name
            description: $description
            resource: $resource
            app: $app
            content: $content
        ) {
            id
        }
    }
`;

const CREATE_RESOURCE = gql`
    mutation CreateResource(
        $name: String!
        $description: String
        $type: ResourceType!
        $mysql: MySQLConfigurationInput
        $postgres: PostgresConfigurationInput
        $mongodb: MongoDBConfigurationInput
        $bigquery: BigQueryConfigurationInput
    ) {
        createResource(
            name: $name
            description: $description
            type: $type
            mysql: $mysql
            postgres: $postgres
            mongodb: $mongodb
            bigquery: $bigquery
        ) {
            id
        }
    }
`;

const isNotFoundError = (error0: unknown): boolean => {
    if (error0 instanceof ApolloError) {
        const error = error0 as ApolloError;
        if (
            error.graphQLErrors.length > 0 &&
            error.graphQLErrors[0].extensions.code === "NOT_FOUND_ERROR"
        ) {
            return true;
        }
    }
    return false;
};

export default class Client<T> {
    client: ApolloClient<T>;

    constructor(client: ApolloClient<T>) {
        this.client = client;
    }

    async getAppByName(name: string): Promise<App | null> {
        try {
            const app = await this.client.query({
                query: GET_APP_BY_NAME,
                variables: {
                    name: name,
                },
            });
            return app.data.getAppByName;
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return null;
            }
            throw error;
        }
    }

    async syncManifest(manifest: Manifest) {
        const { app, queries, resources } = manifest;

        // const deployedApp = await this.getAppByName(app.name);

        const convertNameToId = (name: string, type: string) => {
            return "507f1f77bcf86cd799439011";
        };

        await this.client.mutate({
            mutation: CREATE_APP,
            variables: {
                name: app.name,
                title: app.title,
                description: app.description,
                groups:
                    app.groups.length > 0
                        ? app.groups.map((group) =>
                              convertNameToId(group, "group"),
                          )
                        : [convertNameToId("default", "group")],
                resources: [],
            },
        });

        for (const query of queries) {
            await this.client.mutate({
                mutation: CREATE_QUERY_TEMPLATE,
                variables: {
                    name: query.name,
                    description: query.description,
                    resource: convertNameToId(query.resource, "resource"),
                    app: convertNameToId(app.name, "app"),
                    content: query.content,
                },
            });
        }

        for (const resource of resources) {
            await this.client.mutate({
                mutation: CREATE_RESOURCE,
                variables: {
                    name: resource.name,
                    description: resource.description,
                    type: resource.type,
                    [resource.type]: resource.connection,
                },
            });
        }
    }
}

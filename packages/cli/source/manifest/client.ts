import type { ApolloClient } from "@apollo/client";

import { gql } from "@apollo/client";

import type { Manifest } from "../types";

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

export default class Client<T> {
    client: ApolloClient<T>;

    constructor(client: ApolloClient<T>) {
        this.client = client;
    }

    async syncManifest(manifest: Manifest) {
        const { app, queries } = manifest;

        const convertNameToId = (name: string, type: string) => {
            return "507f1f77bcf86cd799439011";
        };

        await this.client.mutate({
            mutation: CREATE_APP,
            variables: {
                name: app.name,
                title: app.title,
                description: app.description,
                groups: app.groups.length > 0 ? app.groups : ["default"],
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
    }
}

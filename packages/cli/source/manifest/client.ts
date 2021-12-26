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

export default class Client<T> {
    client: ApolloClient<T>;

    constructor(client: ApolloClient<T>) {
        this.client = client;
    }

    async syncManifest(manifest: Manifest) {
        const { app } = manifest;

        return await this.client.mutate({
            mutation: CREATE_APP,
            variables: {
                name: app.name,
                title: app.title,
                description: app.description,
                groups: app.groups.length > 0 ? app.groups : ["default"],
                resources: [],
            },
        });
    }
}

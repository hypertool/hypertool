import type { ApolloClient } from "@apollo/client";

import { gql, ApolloError } from "@apollo/client";
import lodash from "lodash";

import type { Manifest, App, Query, Resource } from "../types";

const GET_APP_BY_NAME = gql`
    query GetAppByName($name: String!) {
        getAppByName(name: $name) {
            id
            name
            title
            slug
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
        $slug: String!
        $description: String
        $groups: [ID!]
        $resources: [ID!]
    ) {
        createApp(
            name: $name
            title: $title
            slug: $slug
            description: $description
            groups: $groups
            resources: $resources
        ) {
            id
        }
    }
`;

const UPDATE_APP = gql`
    mutation UpdateApp(
        $appId: ID!
        $name: String
        $title: String
        $slug: String
        $description: String
        $groups: [ID!]
        $resources: [ID!]
    ) {
        updateApp(
            appId: $appId
            name: $name
            title: $title
            slug: $slug
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

    convertNameToId(name: string, type: string) {
        return "507f1f77bcf86cd799439011";
    }

    async createApp(app: App): Promise<void> {
        await this.client.mutate({
            mutation: CREATE_APP,
            variables: {
                name: app.name,
                title: app.title,
                slug: app.slug,
                description: app.description,
                groups: app.groups.map((group) =>
                    this.convertNameToId(group, "group"),
                ),
                resources: [],
            },
        });
    }

    async updateApp(appId: string, app: App): Promise<void> {
        await this.client.mutate({
            mutation: UPDATE_APP,
            variables: {
                appId,
                name: app.name,
                title: app.title,
                slug: app.slug,
                description: app.description,
                /* Any implicit value injection to the manifests must be done
                 * during compilation by the compiler, not when syncing changes.
                 */
                groups: app.groups.map((group) =>
                    this.convertNameToId(group, "group"),
                ),
                resources: [],
            },
        });
    }

    async createQuery(query: Query, appName: string): Promise<void> {
        await this.client.mutate({
            mutation: CREATE_QUERY_TEMPLATE,
            variables: {
                name: query.name,
                description: query.description,
                resource: this.convertNameToId(query.resource, "resource"),
                app: this.convertNameToId(appName, "app"),
                content: query.content,
            },
        });
    }

    async createResource(resource: Resource, appName: string): Promise<void> {
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

    async patchApp(oldApp: App, newApp: App): Promise<boolean> {
        const keys = ["name", "slug", "description", "title", "groups"];
        const oldAppPicked = lodash.pick(oldApp, keys);
        const newAppPicked = lodash.pick(newApp, keys);

        if (!oldAppPicked || !newAppPicked) {
            throw new Error("lodash.pick() returned undefined for some reason");
        }

        /* `oldAppPicked.groups` contains IDs, not names. Therefore, convert
         * names in `newAppPicked.groups` to their corresponding IDs before
         * comparing.
         */
        newAppPicked.groups = newAppPicked?.groups?.map((group) =>
            this.convertNameToId(group, "group"),
        );

        if (lodash.isEqual(oldAppPicked, newAppPicked)) {
            return false;
        }

        await this.updateApp(oldApp.id as string, newApp);

        return true;
    }

    async syncManifest(manifest: Manifest) {
        const { app, queries, resources } = manifest;

        const deployedApp = await this.getAppByName(app.name);
        if (!deployedApp) {
            await this.createApp(app);
        } else {
            await this.patchApp(deployedApp, app);
        }

        for (const query of queries) {
            await this.createQuery(query, app.name);
        }

        for (const resource of resources) {
            await this.createResource(resource, app.name);
        }
    }
}

import type { ApolloClient } from "@apollo/client/core";
import { ApolloError } from "@apollo/client/core";
import lodash from "lodash";

import type {
    Manifest,
    IApp,
    IQueryTemplate as QueryTemplate,
    IExternalResource,
    IResource,
    ActivityLog,
    ActivityLogPage
} from "../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gql = (value: any): any => null;

const GET_APP_BY_NAME = gql`
    # query GetAppByName($name: String!) {
    #     getAppByName(name: $name) {
    #         id
    #         name
    #         title
    #         slug
    #         description
    #         resources
    #         status
    #         createdAt
    #         updatedAt
    #     }
    # }
`;

const CREATE_APP = gql`
    # mutation CreateApp(
    #     $name: String!
    #     $title: String!
    #     $slug: String!
    #     $description: String
    # ) {
    #     createApp(
    #         name: $name
    #         title: $title
    #         slug: $slug
    #         description: $description
    #     ) {
    #         id
    #     }
    # }
`;

const UPDATE_APP = gql`
    # mutation UpdateApp(
    #     $appId: ID!
    #     $name: String
    #     $title: String
    #     $slug: String
    #     $description: String
    # ) {
    #     updateApp(
    #         appId: $appId
    #         name: $name
    #         title: $title
    #         slug: $slug
    #         description: $description
    #     ) {
    #         id
    #     }
    # }
`;

const GET_QUERY_TEMPLATE_BY_NAME = gql`
    # query GetQueryTemplateByName($name: String!) {
    #     getQueryTemplateByName(name: $name) {
    #         id
    #         name
    #         description
    #         content
    #     }
    # }
`;

const CREATE_QUERY_TEMPLATE = gql`
    # mutation CreateQueryTemplate(
    #     $name: String!
    #     $description: String
    #     $resource: ID!
    #     $app: ID!
    #     $content: String!
    # ) {
    #     createQueryTemplate(
    #         name: $name
    #         description: $description
    #         resource: $resource
    #         app: $app
    #         content: $content
    #     ) {
    #         id
    #     }
    # }
`;

const UPDATE_QUERY_TEMPLATE = gql`
    # mutation UpdateQueryTemplate(
    #     $queryTemplateId: ID!
    #     $name: String
    #     $description: String
    #     $content: String
    # ) {
    #     updateQueryTemplate(
    #         queryTemplateId: $queryTemplateId
    #         name: $name
    #         description: $description
    #         content: $content
    #     ) {
    #         id
    #     }
    # }
`;

const GET_RESOURCE_BY_NAME = gql`
    # query GetResourceByName($name: String!) {
    #     getResourceByName(name: $name) {
    #         id
    #         name
    #         description
    #         type
    #         mysql {
    #             host
    #             port
    #             databaseName
    #             databaseUserName
    #             databasePassword
    #             connectUsingSSL
    #         }
    #         postgres {
    #             host
    #             port
    #             databaseName
    #             databaseUserName
    #             databasePassword
    #             connectUsingSSL
    #         }
    #         mongodb {
    #             host
    #             port
    #             databaseName
    #             databaseUserName
    #             databasePassword
    #             connectUsingSSL
    #         }
    #         bigquery {
    #             key
    #         }
    #         status
    #         createdAt
    #         updatedAt
    #     }
    # }
`;

const CREATE_RESOURCE = gql`
    # mutation CreateResource(
    #     $name: String!
    #     $description: String
    #     $type: ResourceType!
    #     $mysql: MySQLConfigurationInput
    #     $postgres: PostgresConfigurationInput
    #     $mongodb: MongoDBConfigurationInput
    #     $bigquery: BigQueryConfigurationInput
    # ) {
    #     createResource(
    #         name: $name
    #         description: $description
    #         type: $type
    #         mysql: $mysql
    #         postgres: $postgres
    #         mongodb: $mongodb
    #         bigquery: $bigquery
    #     ) {
    #         id
    #     }
    # }
`;

const UPDATE_RESOURCE = gql`
    # mutation UpdateResource(
    #     $resourceId: ID!
    #     $name: String
    #     $description: String
    #     $mysql: MySQLConfigurationInput
    #     $postgres: PostgresConfigurationInput
    #     $mongodb: MongoDBConfigurationInput
    #     $bigquery: BigQueryConfigurationInput
    # ) {
    #     updateResource(
    #         resourceId: $resourceId
    #         name: $name
    #         description: $description
    #         mysql: $mysql
    #         postgres: $postgres
    #         mongodb: $mongodb
    #         bigquery: $bigquery
    #     ) {
    #         id
    #     }
    # }
`;

const GENERATE_SIGNED_URLS = gql`
    # mutation GenerateSignedURLs($appId: ID!, $files: [String!]!) {
    #     generateSignedURLs(appId: $appId, files: $files) {
    #         signedURLs
    #     }
    # }
`;

const CREATE_MEMBERSHIP = gql`
    # mutation CreateMembership(
    #     $emailAddress: String!
    #     $organizationId: ID!
    #     $inviterId: ID!
    # ) {
    #     createMembership(
    #         emailAddress: $emailAddress
    #         organizationId: $organizationId
    #         inviterId: $inviterId
    #     ) {
    #         id
    #     }
    # }
`;

const CREATE_ACTIVITY_LOG = gql`
    # mutation CreateActivityLog(
    #     $message: String!
    #     $component: ComponentOrigin!
    #     $context: GraphQLJSON
    # ) {
    #     createActivityLog(
    #         message: $message
    #         context: $context
    #         component: $component
    #     ) {

    #     }
    # }
`;

const UPDATE_PASSWORD = gql`
    # mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    #     updatePassword(oldPassword: $emailAddress, newPassword: $password) {
    #         id
    #     }
    # }
`;

const GET_ACTIVITY_LOG_BY_ID = gql`
    # query GetActivityLogById($activityLogId: String!) {
    #     getActivityLogById(activityLogId: $activityLogId) {
    #         id
    #         message
    #         context
    #         component
    #     }
    # }
`;

const GET_ACTIVITY_LOGS = gql`
    # query GetActivityLogs($page: Int!, $limit: Int!) {
    #     getActivityLogs(page: $page, limit: $limit) {
    #         totalRecords
    #         totalPages
    #         previousPage
    #         nextPage
    #         hasPreviousPage
    #         hasNextPage
    #         records
    #     }
    # }
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

    getAppByName = async (name: string): Promise<IApp | null> => {
        try {
            const app = await this.client.query({
                query: GET_APP_BY_NAME,
                variables: {
                    name,
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

    /**
     * During name resolution, `name` is used fetch the corresponding
     * entity based on `type`. This would become highly inefficient without
     * Apollo Client's in-memory caching mechanism.
     *
     * NOTE: The hit rate of the cache has not been tested.
     */
    convertNameToId = async (name: string, type: string): Promise<string> => {
        switch (type) {
            case "app": {
                const app = await this.getAppByName(name);
                if (!app) {
                    throw new Error(`Cannot resolve unknown app ${name}`);
                }
                return (app as any).id as string;
            }

            case "resource": {
                /*
                 * NOTE: For this resolution to work, all the resources must be
                 * created before the queries because queries refer resources.
                 */
                const resource = await this.getResourceByName(name);
                if (!resource) {
                    throw new Error(`Cannot resolve unknown resource ${name}`);
                }
                return resource.id as string;
            }

            case "group": {
                /* TODO */
                return "507f1f77bcf86cd799439011";
            }

            default: {
                throw new Error(`Unknown type ${type}`);
            }
        }
    }

    createApp = async (app: IApp): Promise<void> => {
        // await this.client.mutate({
        //     mutation: CREATE_APP,
        //     variables: {
        //         name: app.name,
        //         title: app.title,
        //         slug: app.slug,
        //         description: app.description,
        //     },
        // });
    }

    updateApp = async (appId: string, app: IApp): Promise<void> => {
        // await this.client.mutate({
        //     mutation: UPDATE_APP,
        //     variables: {
        //         appId,
        //         name: app.name,
        //         title: app.title,
        //         slug: app.slug,
        //         description: app.description,
        //     },
        // });
    }

    getQueryTemplateByName = async (name: string): Promise<QueryTemplate | null> => {
        try {
            const queryTemplate = await this.client.query({
                query: GET_QUERY_TEMPLATE_BY_NAME,
                variables: {
                    name,
                },
            });
            return queryTemplate.data.getQueryTemplateByName;
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return null;
            }
            throw error;
        }
    }

    createQueryTemplate = async (
        queryTemplate: QueryTemplate,
        appName: string,
    ): Promise<void> => {
        await this.client.mutate({
            mutation: CREATE_QUERY_TEMPLATE,
            variables: {
                name: queryTemplate.name,
                description: queryTemplate.description,
                resource: await this.convertNameToId(
                    <string>queryTemplate.resource,
                    "resource",
                ),
                app: await this.convertNameToId(appName, "app"),
                content: queryTemplate.content,
            },
        });
    }

    updateQueryTemplate = async (
        queryTemplateId: string,
        queryTemplate: QueryTemplate,
    ): Promise<void> => {
        await this.client.mutate({
            mutation: UPDATE_QUERY_TEMPLATE,
            variables: {
                queryTemplateId,
                name: queryTemplate.name,
                description: queryTemplate.description,
                content: queryTemplate.content,
            },
        });
    }

    getResourceByName = async (name: string): Promise<IExternalResource | null> => {
        try {
            const resource = await this.client.query({
                query: GET_RESOURCE_BY_NAME,
                variables: {
                    name,
                },
            });
            return resource.data.getResourceByName;
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return null;
            }
            throw error;
        }
    }

    createResource = async (resource: IResource): Promise<void> => {
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

    updateResource = async (
        resourceId: string,
        resource: IResource,
    ): Promise<void> => {
        await this.client.mutate({
            mutation: UPDATE_RESOURCE,
            variables: {
                resourceId,
                name: resource.name,
                description: resource.description,
                [resource.type]: resource.connection,
            },
        });
    }

    patchApp = async (oldApp: IApp, newApp: IApp): Promise<boolean> => {
        const keys = ["name", "slug", "description", "title"];
        const oldAppPicked = lodash.pick(oldApp, keys);
        const newAppPicked = lodash.pick(newApp, keys);

        if (!oldAppPicked || !newAppPicked) {
            throw new Error("lodash.pick() returned undefined for some reason");
        }

        if (lodash.isEqual(oldAppPicked, newAppPicked)) {
            return false;
        }

        await this.updateApp((oldApp as any).id as string, newApp);

        return true;
    }

    patchQueryTemplate = async (
        oldQueryTemplate: QueryTemplate,
        newQueryTemplate: QueryTemplate,
    ): Promise<boolean> => {
        const keys = ["name", "description", "content"];
        const oldQueryTemplatePicked = lodash.pick(oldQueryTemplate, keys);
        const newQueryTemplatePicked = lodash.pick(newQueryTemplate, keys);

        if (!oldQueryTemplatePicked || !newQueryTemplatePicked) {
            throw new Error("lodash.pick() returned undefined for some reason");
        }

        if (lodash.isEqual(oldQueryTemplatePicked, newQueryTemplatePicked)) {
            return false;
        }

        await this.updateQueryTemplate(
            (oldQueryTemplate as any).id as string,
            newQueryTemplate,
        );
        return true;
    }

    patchResource = async (
        oldResource: IResource,
        newResource: IResource,
    ): Promise<boolean> => {
        /*
         * TODO: At the moment, the connection object does not have any optional keys.
         * When optional keys are present, the following picking logic needs to
         * to be updated accordingly.
         */
        const keys = ["name", "description", "type"];
        const pickListByType = {
            mysql: [
                "databaseUserName",
                "databasePassword",
                "databaseName",
                "host",
                "port",
                "connectUsingSSL",
            ],
            postgres: [
                "databaseUserName",
                "databasePassword",
                "databaseName",
                "host",
                "port",
                "connectUsingSSL",
            ],
            mongodb: [
                "databaseUserName",
                "databasePassword",
                "databaseName",
                "host",
                "port",
                "connectUsingSSL",
            ],
            bigquery: ["key"],
        };
        const oldAppPicked = lodash.pick(oldResource, keys);
        const newAppPicked = lodash.pick(newResource, keys);

        if (!oldAppPicked || !newAppPicked) {
            throw new Error("lodash.pick() returned undefined for some reason");
        }

        if (
            lodash.isEqual(oldAppPicked, newAppPicked) &&
            /*
             * Compare `oldResource[mysql|postgres|mongodb|bigquery]` with
             * `newResource.connection`
             */
            lodash.isEqual(
                lodash.pick(
                    (oldResource as any)[newResource.type],
                    (pickListByType as any)[newResource.type],
                ),
                lodash.pick(
                    newResource.connection,
                    (pickListByType as any)[newResource.type],
                ),
            )
        ) {
            return false;
        }

        await this.updateResource(
            (oldResource as any).id as string,
            newResource,
        );

        return true;
    }

    syncManifest = async  (manifest: Manifest) => {
        const { app, queries, resources } = manifest;

        const deployedApp = await this.getAppByName(app.name);
        if (!deployedApp) {
            await this.createApp(app);
        } else {
            await this.patchApp(deployedApp, app);
        }

        const promises = [];
        /* TODO: Fetch all the resources at once and then run the patching algorithm. */
        for (const resource of resources) {
            const promise = this.getResourceByName(
                resource.name,
            ).then((deployedResource): Promise<boolean | void> => {
                if (!deployedResource) {
                    return this.createResource(resource);
                } else {
                    return this.patchResource(deployedResource as any, resource);
                }
            });
            promises.push(promise);
        }
        await Promise.all(promises);

        /* TODO: Fetch all the queries at once and then run the patching algorithm. */
        const promises2 = [];
        for (const queryTemplate of queries) {
            const promise = this.getQueryTemplateByName(
                queryTemplate.name,
            ).then((deployedQueryTemplate): Promise<void | boolean> => {
                if (!deployedQueryTemplate) {
                    return this.createQueryTemplate(queryTemplate, app.name);
                } else {
                    return this.patchQueryTemplate(
                        deployedQueryTemplate,
                        queryTemplate,
                    );
                }
            });
            promises2.push(promise);
        }
    }

    generateSignedURLs = async (
        appId: string,
        files: string[],
    ): Promise<string[]> => {
        const app = await this.client.mutate({
            mutation: GENERATE_SIGNED_URLS,
            variables: {
                appId,
                files,
            },
        });
        return app.data.generateSignedURLs;
    };

    createMembership = async (
        emailAddress,
        inviterId,
        organizationId,
    ): Promise<void> => {
        await this.client.mutate({
            mutation: CREATE_MEMBERSHIP,
            variables: {
                emailAddress,
                inviterId,
                organizationId,            },
            });
        };

    createActivityLog = async  (activityLog: ActivityLog): Promise<void> => {
        await this.client.mutate({
            mutation: CREATE_ACTIVITY_LOG,
            variables: {
                message: activityLog.message,
                component: activityLog.component,
                context: activityLog.context,
            },
        });
    }

    async getActivityLogById(
        activityLogId: string,
    ): Promise<ActivityLog | null> {
        try {
            const activityLog = await this.client.query({
                query: GET_ACTIVITY_LOG_BY_ID,
                variables: {
                    activityLogId: activityLogId,
                },
            });

            return activityLog.data.getActivityLogById;
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return null;
            }
            throw error;
        }
    }

    async getActivityLogs(
        page: number,
        limit: number,
    ): Promise<ActivityLogPage | null> {
        try {
            const activityLog = await this.client.query({
                query: GET_ACTIVITY_LOGS,
                variables: {
                    page,
                    limit,
                },
            });

            return activityLog.data.getActivityLogs;
        } catch (error: unknown) {
            if (isNotFoundError(error)) {
                return null;
            }
            throw error;
        }
    }

    async updatePassword({ oldPassword, newPassword }): Promise<void> {
        await this.client.mutate({
            mutation: UPDATE_PASSWORD,
            variables: {
                oldPassword,
                newPassword
            }
        })
    }
}

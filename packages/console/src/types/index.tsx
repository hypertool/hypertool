import { resourceStatuses, resourceTypes } from "../utils/constants";

export type ResourceType = typeof resourceTypes[number];

export type ResourceStatus = typeof resourceStatuses[number];

export interface MySQLConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    connectUsingSSL: boolean;
}

export interface PostgresConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    connectUsingSSL: boolean;
}

export interface MongoDBConfiguration {
    host: string;
    port: number;
    databaseName: string;
    databaseUserName: string;
    connectUsingSSL: boolean;
}

export interface BigQueryConfiguration {
    [key: string]: any;
}

export interface Resource {
    id: string;
    name: string;
    description: string;
    type: ResourceType;
    configuration:
        | MySQLConfiguration
        | PostgresConfiguration
        | MongoDBConfiguration
        | BigQueryConfiguration;
    status: ResourceStatus;
}

export interface AuthenticationServicesType {
    id: number;
    name: string;
    description: string;
}

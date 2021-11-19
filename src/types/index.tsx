export type ResourceType = "mysql" | "postgres" | "mongodb" | "rest_api" | "graphql";

export interface Resource {
    type: ResourceType;
    title: string;
    imageURL: string;
};
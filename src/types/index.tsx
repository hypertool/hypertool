export const tuple = <T extends string[]>(...values: T) => values;

export type ResourceType =
  // Database
  | "mysql"
  | "postgres"
  | "microsoft_sql"
  | "mongodb"
  | "cassandra"
  | "cosmosdb"
  | "amazon_redshift"
  | "amazon_athena"
  | "bigquery"
  | "elasticsearch"
  | "couchdb"
  | "rethinkdb"
  | "snowflake"
  | "denodo"
  | "redis"
  | "dynamodb"
  
  // APIs
  | "rest_api"
  | "graphql"
  | "firebase"
  | "stripe"
  | "twilio"
  | "github"
  | "google_sheets"
  | "salesforce"
  | "sendgrid"
  | "amazon_s3"
  | "google_cloud_storage"
  | "datadog"
  | "lambda"
  | "openapi"
  | "smtp"
  | "slack"
  | "asana"
  | "jira"
  | "close"
  | "bigid"
  | "basecamp"
  | "onesignal"
  | "front"
  | "google_maps"
  | "circleci"
  ;

export interface Resource {
  type: ResourceType;
  title: string;
  imageURL: string;
}

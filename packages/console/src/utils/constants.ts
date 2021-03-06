const tuple = <T extends string[]>(...values: T) => values;

export const tabTypes = tuple(
    "edit-query",
    "new-query",
    "new-controller",
    "edit-controller",
    "new-screen",
    "edit-screen",
    "new-resource",
    "edit-resource",
    "authentication.new-user",
    "authentication.edit-user",
    "authentication.view-users",
    "authentication.view-providers",
    "authentication.new-provider",
);

export const controllerLanguages = tuple("javascript", "typescript");

export const slugPattern = /^(\/:?[-_.a-zA-Z0-9]+)+$/;

export const providerTypes = tuple("email_password", "anonymous");

export const resourceStatuses = tuple(
    "enabled",
    "disabled",
    "deleted",
    "banned",
);

export const resourceTypes = tuple(
    // Databases
    "mysql",
    "postgres",
    "microsoft_sql",
    "mongodb",
    "cassandra",
    "cosmosdb",
    "amazon_redshift",
    "amazon_athena",
    "bigquery",
    "elasticsearch",
    "couchdb",
    "rethinkdb",
    "snowflake",
    "denodo",
    "redis",
    "dynamodb",

    // APIs
    "rest_api",
    "graphql",
    "firebase",
    "stripe",
    "twilio",
    "github",
    "google_sheets",
    "salesforce",
    "sendgrid",
    "amazon_s3",
    "google_cloud_storage",
    "datadog",
    "lambda",
    "openapi",
    "smtp",
    "slack",
    "asana",
    "jira",
    "close",
    "bigid",
    "basecamp",
    "onesignal",
    "front",
    "google_maps",
    "circleci",
);

import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import type { Resource } from "../../types";

const Root = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  width: "100%",
}));

interface Category {
  title: string;
  resources: Resource[];
}

const categories: Category[] = [
  {
    title: "Databases",
    resources: [
      {
        type: "postgres",
        title: "Postgres",
        imageURL: "",
      },
      {
        type: "mysql",
        title: "MySQL",
        imageURL: "",
      },
      {
        type: "microsoft_sql",
        title: "Microsoft SQL",
        imageURL: "",
      },
      {
        type: "mongodb",
        title: "MongoDB",
        imageURL: "",
      },
      {
        type: "cassandra",
        title: "Cassandra",
        imageURL: "",
      },
      {
        type: "cosmosdb",
        title: "CosmosDB",
        imageURL: "",
      },
      {
        type: "amazon_redshift",
        title: "Amazon Redshift",
        imageURL: "",
      },
      {
        type: "amazon_athena",
        title: "Amazon Athena",
        imageURL: "",
      },
      {
        type: "bigquery",
        title: "BigQuery",
        imageURL: "",
      },
      {
        type: "elasticsearch",
        title: "Elastic Search",
        imageURL: "",
      },
      {
        type: "couchdb",
        title: "CouchDB",
        imageURL: "",
      },
      {
        type: "rethinkdb",
        title: "RethinkDB",
        imageURL: "",
      },
      {
        type: "snowflake",
        title: "Snowflake",
        imageURL: "",
      },
      {
        type: "denodo",
        title: "Denodo",
        imageURL: "",
      },
      {
        type: "redis",
        title: "Redis",
        imageURL: "",
      },
      {
        type: "dynamodb",
        title: "DynamoDB",
        imageURL: "",
      },
    ],
  },
  {
    title: "APIs",
    resources: [
      {
        type: "rest_api",
        title: "REST API",
        imageURL: "",
      },
      {
        type: "graphql",
        title: "GraphQL",
        imageURL: "",
      },
      {
        type: "firebase",
        title: "Firebase",
        imageURL: "",
      },
      {
        type: "stripe",
        title: "Stripe",
        imageURL: "",
      },
      {
        type: "twilio",
        title: "Twilio",
        imageURL: "",
      },
      {
        type: "github",
        title: "GitHub",
        imageURL: "",
      },
      {
        type: "google_sheets",
        title: "Google Sheets",
        imageURL: "",
      },
      {
        type: "salesforce",
        title: "Salesforce",
        imageURL: "",
      },
      {
        type: "sendgrid",
        title: "Sendgrid",
        imageURL: "",
      },
      {
        type: "amazon_s3",
        title: "Amazon S3",
        imageURL: "",
      },
      {
        type: "google_cloud_storage",
        title: "Google Cloud Storage",
        imageURL: "",
      },
      {
        type: "datadog",
        title: "Datadog",
        imageURL: "",
      },
      {
        type: "lambda",
        title: "Lambda",
        imageURL: "",
      },
      {
        type: "openapi",
        title: "OpenAPI",
        imageURL: "",
      },
      {
        type: "smtp",
        title: "SMTP",
        imageURL: "",
      },
      {
        type: "slack",
        title: "Slack",
        imageURL: "",
      },
      {
        type: "asana",
        title: "Asana",
        imageURL: "",
      },
      {
        type: "jira",
        title: "Jira",
        imageURL: "",
      },
      {
        type: "close",
        title: "Close",
        imageURL: "",
      },
      {
        type: "bigid",
        title: "BigID",
        imageURL: "",
      },
      {
        type: "basecamp",
        title: "Basecamp",
        imageURL: "",
      },
      {
        type: "onesignal",
        title: "OneSignal",
        imageURL: "",
      },
      {
        type: "front",
        title: "Front",
        imageURL: "",
      },
      {
        type: "google_maps",
        title: "Google Maps",
        imageURL: "",
      },
      {
        type: "circleci",
        title: "CircleCI",
        imageURL: "",
      },
    ],
  },
];

const SelectStep: FunctionComponent = (): ReactElement => {
  return <Root>Select Step</Root>;
};

export default SelectStep;

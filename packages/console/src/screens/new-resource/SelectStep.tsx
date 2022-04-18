import type { FunctionComponent, ReactElement } from "react";

import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { ResourceType } from "../../types";

import ResourceItem from "./ResourceItem";

const Root = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

const Category = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
}));

const CategoryContent = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: -8,
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    color: theme.palette.getContrastText(theme.palette.background.default),
}));

interface Resource {
    type: ResourceType;
    title: string;
    imageURL: string;
}

interface CategoryModel {
    title: string;
    resources: Resource[];
}

const categories: CategoryModel[] = [
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
            /*
             * {
             *   type: "microsoft_sql",
             *   title: "Microsoft SQL",
             *   imageURL: "",
             * },
             * {
             *     type: "mongodb",
             *     title: "MongoDB",
             *     imageURL: "",
             * },
             * {
             *   type: "cassandra",
             *   title: "Cassandra",
             *   imageURL: "",
             * },
             * {
             *   type: "cosmosdb",
             *   title: "CosmosDB",
             *   imageURL: "",
             * },
             * {
             *   type: "amazon_redshift",
             *   title: "Amazon Redshift",
             *   imageURL: "",
             * },
             * {
             *   type: "amazon_athena",
             *   title: "Amazon Athena",
             *   imageURL: "",
             * },
             * {
             *     type: "bigquery",
             *     title: "BigQuery",
             *     imageURL: "",
             * },
             * {
             *   type: "elasticsearch",
             *   title: "Elastic Search",
             *   imageURL: "",
             * },
             * {
             *   type: "couchdb",
             *   title: "CouchDB",
             *   imageURL: "",
             * },
             * {
             *   type: "rethinkdb",
             *   title: "RethinkDB",
             *   imageURL: "",
             * },
             * {
             *   type: "snowflake",
             *   title: "Snowflake",
             *   imageURL: "",
             * },
             * {
             *   type: "denodo",
             *   title: "Denodo",
             *   imageURL: "",
             * },
             * {
             *   type: "redis",
             *   title: "Redis",
             *   imageURL: "",
             * },
             * {
             *   type: "dynamodb",
             *   title: "DynamoDB",
             *   imageURL: "",
             * },
             */
        ],
    },
    /*
     * {
     *     title: "APIs",
     *     resources: [
     *         {
     *             type: "rest_api",
     *             title: "REST API",
     *             imageURL: "",
     *         },
     *         {
     *             type: "graphql",
     *             title: "GraphQL",
     *             imageURL: "",
     *         },
     *         {
     *             type: "firebase",
     *             title: "Firebase",
     *             imageURL: "",
     *         },
     *         {
     *             type: "stripe",
     *             title: "Stripe",
     *             imageURL: "",
     *         },
     *         {
     *             type: "twilio",
     *             title: "Twilio",
     *             imageURL: "",
     *         },
     *         {
     *             type: "github",
     *             title: "GitHub",
     *             imageURL: "",
     *         },
     *         {
     *             type: "google_sheets",
     *             title: "Google Sheets",
     *             imageURL: "",
     *         },
     *         {
     *             type: "salesforce",
     *             title: "Salesforce",
     *             imageURL: "",
     *         },
     *         {
     *             type: "sendgrid",
     *             title: "Sendgrid",
     *             imageURL: "",
     *         },
     *         {
     *             type: "amazon_s3",
     *             title: "Amazon S3",
     *             imageURL: "",
     *         },
     *         {
     *             type: "google_cloud_storage",
     *             title: "Google Cloud Storage",
     *             imageURL: "",
     *         },
     *         {
     *             type: "datadog",
     *             title: "Datadog",
     *             imageURL: "",
     *         },
     *         {
     *             type: "lambda",
     *             title: "Lambda",
     *             imageURL: "",
     *         },
     *         {
     *             type: "openapi",
     *             title: "OpenAPI",
     *             imageURL: "",
     *         },
     *         {
     *             type: "smtp",
     *             title: "SMTP",
     *             imageURL: "",
     *         },
     *         {
     *             type: "slack",
     *             title: "Slack",
     *             imageURL: "",
     *         },
     *         {
     *             type: "asana",
     *             title: "Asana",
     *             imageURL: "",
     *         },
     *         {
     *             type: "jira",
     *             title: "Jira",
     *             imageURL: "",
     *         },
     *         {
     *             type: "close",
     *             title: "Close",
     *             imageURL: "",
     *         },
     *         {
     *             type: "bigid",
     *             title: "BigID",
     *             imageURL: "",
     *         },
     *         {
     *             type: "basecamp",
     *             title: "Basecamp",
     *             imageURL: "",
     *         },
     *         {
     *             type: "onesignal",
     *             title: "OneSignal",
     *             imageURL: "",
     *         },
     *         {
     *             type: "front",
     *             title: "Front",
     *             imageURL: "",
     *         },
     *         {
     *             type: "google_maps",
     *             title: "Google Maps",
     *             imageURL: "",
     *         },
     *         {
     *             type: "circleci",
     *             title: "CircleCI",
     *             imageURL: "",
     *         },
     *     ],
     * },
     */
];

interface Props {
    onChange: (type: ResourceType) => void;
    activeType: ResourceType | undefined;
}

const SelectStep: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { onChange, activeType } = props;

    const renderCategory = (category: CategoryModel) => (
        <Category>
            <CategoryTitle variant="h2">{category.title}</CategoryTitle>
            <CategoryContent>
                {category.resources.map((resource) => (
                    <ResourceItem
                        key={resource.title}
                        {...resource}
                        onClick={onChange}
                        selected={activeType === resource.type}
                    />
                ))}
            </CategoryContent>
        </Category>
    );

    return <Root>{categories.map(renderCategory)}</Root>;
};

export default SelectStep;

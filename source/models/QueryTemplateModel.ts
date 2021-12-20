import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { Query } from "../types";
import { queryStatuses, queryLifecycleStages } from "../utils/constants";

const queryTemplateSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 1,
            maxlength: 128,
            required: true,
        },
        description: {
            type: String,
            minlength: 0,
            maxlength: 1024,
            default: "",
        },
        resource: {
            type: {
                type: Schema.Types.ObjectId,
                ref: "Resource",
            },
        },
        app: {
            type: {
                type: Schema.Types.ObjectId,
                ref: "App",
            },
        },
        /* Contingent on the resource type, the content should be treated differently by the service
         * executing the query. For example, for MySQL queries, the content is a SQL statement. On
         * the other hand, for MongoDB queries, the content will be a JSON string that will be
         * parsed before execution.
         */
        content: {
            type: String,
            minlength: 1,
            maxlength: 10240,
            required: true,
        },
        status: {
            type: String,
            enum: queryStatuses,
            default: "enabled",
        },
        /* The queries are always processed as a whole by the Hypertool command-line interface.
         * The lifecycle of the queries depends on the YAML configuration files. On the other hand,
         * third-party integrations and Hypertool GUI manipulate the queries individually. These
         * queries are not bound by any YAML configuration files. The lifecycle attribute
         * differentiates queries both these types of queries.
         *
         * This attribute is immutable. In other words, once a lifecycle value is assigned,
         * it cannot be changed.
         */
        lifecycle: {
            type: String,
            enum: queryLifecycleStages,
            required: true,
        },
    },
    { timestamps: true }
);

queryTemplateSchema.plugin(paginate);

export default model<Query>("QueryTemplate", queryTemplateSchema);

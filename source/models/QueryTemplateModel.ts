import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { Query } from "../types";
import { queryStatuses } from "../utils/constants";

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
            type: Schema.Types.ObjectId,
            ref: "Resource",
        },
        app: {
            type: Schema.Types.ObjectId,
            ref: "App",
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
    },
    { timestamps: true }
);

queryTemplateSchema.plugin(paginate);

export default model<Query>("QueryTemplate", queryTemplateSchema);

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

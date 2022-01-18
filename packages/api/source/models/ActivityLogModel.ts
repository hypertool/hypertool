import { Schema, model } from "mongoose";

import type { ActivityLog } from "../types";
import { componentOrigins } from "../utils/constants";

const logSchema = new Schema(
    {
        message: {
            type: String,
            minlength: 1,
            maxlength: 512,
            required: true,
            default: "No message to display",
        },
        component: {
            type: String,
            enum: componentOrigins,
            default: "api",
            required: true,
        },
        context: {
            type: Object,
        },
    },
    {
        timestamps: true,
    },
);

export default model<ActivityLog>("ActivityLog", logSchema);

import { Schema, model } from "mongoose";

import type { IActivityLog } from "../types";
import { componentOrigins } from "../utils/constants";

const activityLogSchema = new Schema(
    {
        message: {
            type: String,
            minlength: 1,
            maxlength: 512,
            required: true,
        },
        component: {
            type: String,
            enum: componentOrigins,
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

export default model<IActivityLog>("ActivityLog", activityLogSchema);

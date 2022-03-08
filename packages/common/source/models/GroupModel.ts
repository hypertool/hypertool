import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { IGroup } from "../types";
import { groupStatuses, groupTypes } from "../utils/constants";

const groupSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 0,
            maxlength: 256,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            minlength: 0,
            maxlength: 512,
            default: "",
        },
        type: {
            type: String,
            enum: groupTypes,
        },
        users: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            required: true,
        },
        apps: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "App",
                },
            ],
            required: true,
        },
        status: {
            type: String,
            enum: groupStatuses,
            default: "enabled",
        },
    },
    {
        timestamps: true,
    },
);

groupSchema.plugin(paginate);

export default model<IGroup>("Group", groupSchema);

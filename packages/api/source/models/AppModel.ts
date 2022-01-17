import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { App } from "../types";
import { appStatuses } from "../utils/constants";

const googleAuthSchema = new Schema(
    {
        enabled: {
            type: Boolean,
            required: true,
        },
        clientId: {
            type: String,
            required: true,
        },
        secret: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

const authServicesSchema = new Schema({
    googleAuth: {
        type: googleAuthSchema,
    },
});

const appSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 1,
            maxlength: 128,
            required: true,
        },
        title: {
            type: String,
            minlength: 1,
            maxlength: 256,
            required: true,
        },
        slug: {
            type: String,
            minlength: 1,
            maxlength: 128,
            required: true,
        },
        description: {
            type: String,
            minlength: 0,
            maxlength: 512,
            default: "",
        },
        groups: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Group",
                },
            ],
            default: [],
        },
        resources: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Resource",
                },
            ],
            default: [],
        },
        // TODO: Add queries
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: appStatuses,
            default: "private",
        },
        authServices: {
            type: authServicesSchema,
        },
    },
    { timestamps: true },
);

appSchema.plugin(paginate);

export default model<App>("App", appSchema);

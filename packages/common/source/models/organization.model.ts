import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { Organization } from "../types";
import {
    organizationMembershipTypes,
    organizationStatuses,
} from "../utils/constants";

const organizationMembershipSchema = new Schema({
    user: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    role: {
        type: String,
        enum: organizationMembershipTypes,
        default: "member",
    },
});

const organizationSchema = new Schema(
    {
        /*
         * An identifier that helps humans identify the organization across
         * Hypertool.
         */
        name: {
            type: String,
            minlength: 1,
            maxlength: 256,
            required: true,
            trim: true,
        },
        /* The display name of the organization. */
        title: {
            type: String,
            minlength: 1,
            maxlength: 256,
            required: true,
            trim: true,
        },
        /* A brief description of the organization. */
        description: {
            type: String,
            minlength: 0,
            maxlength: 512,
            default: "",
        },
        /* The list of users that are part of the organization. */
        members: {
            type: [organizationMembershipSchema],
        },
        /* The list of apps that are part of the organization. */
        apps: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "App",
                },
            ],
        },
        teams: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Team",
                },
            ],
        },
        /*
         * The status of the organization. Valid values are as follows: active,
         * deleted, banned.
         */
        status: {
            type: String,
            enum: organizationStatuses,
            default: "active",
        },
        createdAt: { type: Date, immutable: true },
    },
    {
        timestamps: true,
    },
);

organizationSchema.index({
    name: "text",
});
organizationSchema.plugin(paginate);

export default model<Organization>("Organization", organizationSchema);

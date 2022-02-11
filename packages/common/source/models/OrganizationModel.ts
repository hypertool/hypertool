import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { Organization } from "../types";
import { organizationStatuses } from "../utils/constants";

const organizationSchema = new Schema(
    {
        /*An identifier that helps humans identify the organization across Hypertool.
         */
        name: {
            type: String,
            minlength: 1,
            maxlength: 256,
            required: true,
            trim: true,
        },
        /*The display name of the organization.
         */
        title: {
            type: String,
            minlength: 1,
            maxlength: 256,
            required: true,
            trim: true,
        },
        /* A brief description of the organization.
         */
        description: {
            type: String,
            minlength: 0,
            maxlength: 512,
            default: "",
        },
        /* The list of users that are part of the organization.
         */
        members: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Membership",
                },
            ],
            required: true,
        },
        /* The list of apps that are part of the organization.
         */
        apps: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "App",
                },
            ],
            required: true,
        },
        /* The list of apps that are part of the organization.
         */
        status: {
            type: String,
            enum: organizationStatuses,
            default: "active",
        },
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

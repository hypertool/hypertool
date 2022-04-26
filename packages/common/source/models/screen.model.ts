import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { IScreen } from "../types";
import { screenStatuses } from "../utils/constants";

const screenSchema = new Schema(
    {
        /* An identifier that points to the app to which the screen belongs. */
        app: {
            type: Schema.Types.ObjectId,
            ref: "App",
            required: true,
            immutable: true,
        },

        /*
         * The name of the screen, that uniquely identifies the screen across
         * the application.
         */
        name: {
            type: String,
            minlength: 1,
            maxlength: 256,
            trim: true,
            required: true,
        },

        /* The title of the screen. */
        title: {
            type: String,
            minlength: 1,
            maxlength: 256,
            required: true,
        },

        /* Optional description of the screen. */
        description: {
            type: String,
            maxlength: 512,
        },

        /* The slug of the screen. */
        slug: {
            type: String,
            minlength: 1,
            maxlength: 128,
            required: true,
            trim: true,
        },

        /* The user interface implemented by the screen encoded in JSON. */
        content: {
            type: String,
            trim: true,
        },

        /* The controller associated with the screen. */
        controller: {
            type: Schema.Types.ObjectId,
            ref: "Controller",
            required: true,
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        /* The status of the screen. */
        status: {
            type: String,
            enum: screenStatuses,
            required: true,
        },

        createdAt: { type: Date, immutable: true },
    },
    { timestamps: true },
);

screenSchema.plugin(paginate);

export default model<IScreen>("Screen", screenSchema);

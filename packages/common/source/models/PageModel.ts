import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { Page } from "../types";
import { screenStatues } from "../utils/constants";

const pageSchema = new Schema(
    {
        /* An identifier that points to the app where the comment was created. */
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

        /* The title of the page. */
        title: {
            type: String,
            minlength: 1,
            maxlength: 256,
            required: true,
        },

        /* Optional description of the page. */
        description: {
            type: String,
            minlength: 1,
            maxlength: 512,
        },

        /* The slug of the page. */
        slug: {
            type: String,
            minlength: 1,
            maxlength: 128,
            required: true,
            trim: true,
        },

        /* The status of the screen. */
        status: {
            type: String,
            enum: screenStatues,
            required: true,
        },

        createdAt: { type: Date, immutable: true },
    },
    { timestamps: true },
);

pageSchema.plugin(paginate);
export default model<Page>("Page", pageSchema);

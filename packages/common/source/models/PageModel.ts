import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { IPage } from "../types";

const pageSchema = new Schema(
    {
        /* An identifier that points to the app where the comment was created. */
        app: {
            type: Schema.Types.ObjectId,
            ref: "App",
            required: true,
            immutable: true,
        },

        /* The title of the page. */
        title: {
            type: String,
            minlength: 1,
            maxlength: 128,
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
        createdAt: { type: Date, immutable: true },
    },
    { timestamps: true },
);

pageSchema.plugin(paginate);
export default model<IPage>("Page", pageSchema);

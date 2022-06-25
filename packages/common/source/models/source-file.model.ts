import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { ISourceFile } from "../types";
import { sourceFileStatuses } from "../utils/constants";

const sourceFileSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 1,
            maxlength: 256,
            trim: true,
            required: true,
        },
        directory: {
            type: Boolean,
            required: true,
        },
        /* An identifier that points to the User who created the controller. */
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        /**
         * List of patches that describe the content of the controller.
         *
         * We use the patch format that Git uses to store controller versions
         * in the database. The `diff` package is used to achieve this.
         * We do not keep the "plain" controller source code in the database.
         * When a file is loaded by the console, we apply the patches to generate
         * the latest copy of the file.
         *
         * The console implements three techniques for saving files, preventing
         * data loss.
         * 1. Save button that the user can trigger manually -- data stored as patches
         * 2. Autosave triggered every 1s (configurable by the user) -- data stored as patches
         * 3. Parallel writes to local storage as the user types -- data stored as plain text
         */
        content: {
            type: String,
        },

        /* An identifier that points to the app to which the controller belongs. */
        app: {
            type: Schema.Types.ObjectId,
            ref: "App",
            required: true,
            immutable: true,
        },
        /*
         * An enumeration of string values that describes the status of the
         * controller.
         */
        status: {
            type: String,
            enum: sourceFileStatuses,
            required: true,
        },
        createdAt: { type: Date, immutable: true },
    },
    { timestamps: true },
);

sourceFileSchema.plugin(paginate);
export default model<ISourceFile>("SourceFile", sourceFileSchema);

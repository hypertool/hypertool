import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { Comment } from "../types";
import { commentStatuses } from "../utils/constants";

const commentSchema = new Schema(
    {
        /* An identifier that points to the User who created the comment. */
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        /* A string that describes the contents of the comment. */
        content: {
            type: String,
            minlength: 1,
            maxlength: 512,
            required: true,
        },
        /* A boolean value that describes if the comment is edited or not. */
        edited: {
            type: Boolean,
            default: false,
            required: true,
        },
        /* An enumeration of string values that describes the status of the
         * comment.
         */
        status: {
            type: String,
            enum: commentStatuses,
            required: true,
        },
        /* An identifier that points to the conversation where the comment was
         * created.
         */
        conversation: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        createdAt: { type: Date, immutable: true },
    },
    { timestamps: true },
);

commentSchema.plugin(paginate);
export default model<Comment>("Comment", commentSchema);

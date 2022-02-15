import { Schema, model } from "mongoose";

import type { Conversation } from "../types";
import { conversationStatuses } from "../utils/constants";

function arrayLimit(val) {
    return val.length >= 1;
}

const conversationSchema = new Schema(
    {
        /* An identifier that points to the App where the comment was created. */
        app: {
            type: Schema.Types.ObjectId,
            ref: "App",
            required: true,
            immutable: true,
        },

        /* The name of the Page where the comment was created. */
        page: {
            type: String,
            minlength: 1,
            maxlength: 128,
            required: true,
            immutable: true,
        },

        /* An object that describes the x and y coordinates of the conversation
         * in the canvas.
         */
        coordinates: { type: Object, required: true },

        /* A list of users who have participated in the conversation. */
        taggedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        /* A list of comments in the conversation. The first member is the
         * initiator’s comment.
         */
        comments: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Comment",
                },
            ],
            validate: [arrayLimit, "{PATH} exceeds the limit of 1"],
            required: true,
        },

        /* A enumeration of string values that describes the status of the
         * conversation.
         */
        status: {
            type: String,
            enum: conversationStatuses,
            required: true,
        },
        createdAt: { type: Date, immutable: true },
    },
    { timestamps: true },
);

export default model<Conversation>("Conversation", conversationSchema);

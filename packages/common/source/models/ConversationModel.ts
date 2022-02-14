import { Schema, model } from "mongoose";

import type { Conversation } from "../types";

const commentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        commentText: {
            type: String,
            minlength: 1,
            maxlength: 512,
            required: true,
        },
        edited: {
            type: Boolean,
            default: false,
        },
        createdAt: { type: Date, immutable: true },
    },
    { timestamps: true },
);

const conversationSchema = new Schema(
    {
        app: {
            type: Schema.Types.ObjectId,
            ref: "App",
            required: true,
        },
        page: {
            type: String,
            minlength: 1,
            maxlength: 128,
            required: true,
        },
        coordinates: { type: Object },
        taggedUsers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        comments: { type: [commentSchema], minlength: 1, required: true },

        createdAt: { type: Date, immutable: true },
    },
    { timestamps: true },
);

export default model<Conversation>("Conversation", conversationSchema);

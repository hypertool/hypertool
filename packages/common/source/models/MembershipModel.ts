import { Schema, model } from "mongoose";

import { Membership } from "../types";
import { membershipStatuses, membershipTypes } from "../utils/constants";

const membershipSchema = new Schema(
    {
        member: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        inviter: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        division: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        type: {
            type: String,
            enum: membershipTypes,
            required: true,
        },
        status: {
            type: String,
            enum: membershipStatuses,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default model<Membership>("Membership", membershipSchema);

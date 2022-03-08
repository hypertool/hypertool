import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { Team } from "../types";
import { teamMembershipTypes, teamStatuses } from "../utils/constants";

const teamMembershipSchema = new Schema({
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
        enum: teamMembershipTypes,
        default: "member",
    },
});

const teamSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 0,
            maxlength: 256,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            minlength: 0,
            maxlength: 512,
            default: "",
        },
        members: {
            type: [teamMembershipSchema],
        },
        apps: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "App",
                },
            ],
            required: true,
        },
        status: {
            type: String,
            enum: teamStatuses,
            default: "active",
        },
    },
    {
        timestamps: true,
    },
);

teamSchema.plugin(paginate);

export default model<Team>("Team", teamSchema);

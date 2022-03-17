import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { ITeam } from "../types";
import { teamRoles, teamStatuses } from "../utils/constants";

const membershipSchema = new Schema({
    user: {
        type: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    role: {
        type: String,
        enum: teamRoles,
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
        organization: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
        },
        members: {
            type: [membershipSchema],
        },
        apps: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "App",
                },
            ],
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

export default model<ITeam>("Team", teamSchema);

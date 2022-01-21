import { Schema, model } from "mongoose";
import type { Role } from "../types";

const RoleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 512,
        },
        priviledges: [
            {
                type: String,
                minlength: 1,
                maxlength: 512,
            },
        ],
        enabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        description: {
            type: String,
            min: 1,
            max: 512,
            default: "",
        },
    },
    { timestamps: true },
);

export default model<Role>("Role", RoleSchema);

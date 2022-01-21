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
        privileges: [
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
            default: "",
            min: 1,
            max: 512,
        },
    },
    { timestamps: true },
);

export default model<Role>("Role", RoleSchema);

import { Schema, model } from "mongoose";
import type { Role } from "../types";

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    privildges: [
        {
            type: String,
        },
    ],
});

export default model<Role>("Role", RoleSchema);

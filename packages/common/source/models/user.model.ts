import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { IUser } from "../types";
import { countryCodes, genders, userStatuses } from "../utils/constants";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            minlength: 1,
            maxlength: 30,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            minlength: 1,
            maxlength: 30,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            minlength: 0,
            maxlength: 512,
            default: "",
        },
        gender: {
            type: String,
            enum: genders,
        },
        countryCode: {
            type: String,
            enum: countryCodes,
        },
        pictureURL: {
            type: String,
            trim: true,
            default: null,
        },
        /* The email address should be unique only within an app, not Hypertool. */
        emailAddress: {
            type: String,
            maxlength: 255,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: 8,
            maxlength: 128,
        },
        emailVerified: {
            type: Boolean,
            default: false,
            required: true,
        },
        birthday: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: userStatuses,
            default: "active",
        },
        app: {
            type: Schema.Types.ObjectId,
            ref: "App",
        },
        organizations: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Organization",
                },
            ],
            default: [],
        },
        apps: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "App",
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

userSchema.index({
    firstName: "text",
    lastName: "text",
    emailAddress: "text",
});
userSchema.plugin(paginate);

export default model<IUser>("User", userSchema);

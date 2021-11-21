import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { genders, countryCodes, userStatuses } from "../utils/constants";

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
    emailAddress: {
      type: String,
      maxlength: 255,
      required: true,
      trim: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    roles: {
      type: [String],
      default: [],
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
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  firstName: "text",
  lastName: "text",
  emailAddress: "text",
});
userSchema.plugin(paginate);

export default model("User", userSchema);

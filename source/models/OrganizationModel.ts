import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { Organization } from "../types";
import { organizationStatuses } from "../utils/constants";

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 1,
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
    users: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
    },
    status: {
      type: String,
      enum: organizationStatuses,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

organizationSchema.index({
  name: "text",
});
organizationSchema.plugin(paginate);

export default model<Organization>("Organization", organizationSchema);

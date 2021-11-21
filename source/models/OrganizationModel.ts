import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

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
    members: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: "Member",
      }],
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

export default model("Organization", organizationSchema);

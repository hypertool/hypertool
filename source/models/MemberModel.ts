import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { memberStatuses } from "../utils/constants";

const memberSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  permissions: {
    type: [String],
    required: true,
    default: [],
  },
  status: {
    type: String,
    enum: memberStatuses,
    default: "invited",
  },
});

memberSchema.plugin(paginate);

export default model("Member", memberSchema);
import { Schema, Model, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { resourceTypes, resourceStatuses } from "../utils/constants";

const resourceSchema = new Schema({
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
  type: {
    type: String,
    enum: resourceTypes,
    required: true,
  },
  status: {
    type: String,
    enum: resourceStatuses,
    default: "active",
  },
});

resourceSchema.plugin(paginate);

export default model("Resource", resourceSchema);

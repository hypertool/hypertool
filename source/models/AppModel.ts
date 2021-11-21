import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { appStatuses } from "../utils/constants";

const appSchema = new Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 128,
    required: true,
  },
  members: {
    type: [Schema.Types.ObjectId],
    ref: "Member",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Member",
  },
  status: {
    type: String,
    enum: appStatuses,
    default: "private",
  },
});

appSchema.plugin(paginate);

export default model("App", appSchema);

import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const groupSchema = new Schema({
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
      default: [],
    },
    apps: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "App",
        },
      ],
      required: true,
      default: [],
    },
});

groupSchema.plugin(paginate);

export default model("Group", groupSchema);
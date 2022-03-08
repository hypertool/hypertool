import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { IDeployment } from "../types";

const deploymentSchema = new Schema(
    {
        app: {
            type: Schema.Types.ObjectId,
            ref: "App",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

deploymentSchema.plugin(paginate);

export default model<IDeployment>("Deployment", deploymentSchema);

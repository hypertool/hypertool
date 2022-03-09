import type { IApp, ExternalDeployment, Deployment } from "@hypertool/common";

import joi from "joi";
import {
    google,
    AppModel,
    DeploymentModel,
    BadRequestError,
    NotFoundError,
} from "@hypertool/common";
import mongoose from "mongoose";

const runAsTransaction = async (callback) => {
    return await callback();
};

const generateSchema = joi.object({
    appId: joi.string(),
    files: joi.array().items(joi.string()),
});

interface GenerateSignedURLsAttributes {
    appId: string;
    files: string[];
}

interface GenerateSignedURLsResult {
    signedURLs: string[];
    deployment: ExternalDeployment;
}

const toExternal = (deployment: Deployment): ExternalDeployment => {
    const { _id, app, createdAt, updatedAt } = deployment;
    return {
        id: _id.toString(),
        app:
            typeof app === "string"
                ? app
                : app instanceof mongoose.Types.ObjectId
                ? app.toString()
                : (<IApp>app)._id.toString(),
        createdAt,
        updatedAt,
    };
};

export const generateSignedURLs = async (
    context,
    attributes: GenerateSignedURLsAttributes): Promise<GenerateSignedURLsResult> => {
    const { error, value } = generateSchema.validate(attributes);

    if (error) {
        throw new BadRequestError(error.message);
    }

    const { app, deployment } = await runAsTransaction(async () => {
        const deploymentId = new mongoose.Types.ObjectId();
        const app = await AppModel.findByIdAndUpdate(value.appId, {
            $push: {
                deployments: deploymentId,
            },
        });
        if (!app) {
            throw new NotFoundError(
                "Cannot find an app with the specified identifier.",
            );
        }

        const deployment = new DeploymentModel({
            _id: deploymentId,
            app: value.appId,
        });
        await deployment.save();

        return { app, deployment };
    });

    const promises = [];
    for (const file of value.files) {
        const promise = google.generateUploadSignedURL(
            process.env.APP_BUNDLES_BUCKET_NAME,
            `${
                app.organization
            }/${app._id.toString()}/${deployment._id.toString()}/${file}`,
        );
        promises.push(promise);
    }

    return {
        signedURLs: await Promise.all(promises),
        deployment: toExternal(deployment),
    };
};

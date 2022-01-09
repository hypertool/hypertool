import joi from "joi";
import { Types } from "mongoose";

import { google, BadRequestError } from "../utils";

const generateSchema = joi.array().items(joi.string());

export const generateSignedURLs = async (
    context,
    files: string[]
): Promise<string[]> => {
    const { error, value: files0 } = generateSchema.validate(files);

    if (error) {
        throw new BadRequestError(error.message);
    }

    const deploymentId = new Types.ObjectId();

    // TODO: Prefix `fileName` with organization ID
    const promises = [];
    for (const file of files0) {
        const promise = google.generateUploadSignedURL(
            "hypertool-client-builds-asia",
            `organizationId/${deploymentId.toString()}/${file}`
        );
        promises.push(promise);
    }

    return await Promise.all(promises);
};

import joi from "joi";
import { Types } from "mongoose";

import { google, BadRequestError } from "../utils";

const generateSchema = joi.array().items(joi.string());

export const generateSignedURLs = async (
    context,
    fileNames: string[]
): Promise<string[]> => {
    const { error, value } = generateSchema.validate(fileNames);

    if (error) {
        throw new BadRequestError(error.message);
    }

    const deploymentId = new Types.ObjectId();

    // TODO: Prefix `fileName` with organization ID
    const promises = [];
    for (const fileName of value) {
        const promise = google.generateUploadSignedURL(
            "hypertool-client-builds-asia",
            `organizationId/${deploymentId.toString()}/${fileName}`
        );
        promises.push(promise);
    }

    return await Promise.all(promises);
};

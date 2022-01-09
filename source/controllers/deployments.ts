import joi from "joi";

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

    // TODO: Prefix `fileName` with organization ID and deployment ID.
    const promises = [];
    for (const fileName of value.filesNames) {
        const promise = google.generateUploadSignedURL(
            "hypertool-client-builds-asia",
            fileName
        );
        promises.push(promise);
    }

    return await Promise.all(promises);
};

import axios from "axios";
import fs from "fs";

export const uploadFiles = async (
    files: string[],
    signedURLs: string[],
): Promise<void> => {
    if (files.length !== signedURLs.length) {
        throw new Error(
            `The specified files and signed URLs lists are not of the same length. (files=${files.length}, signed URLs=${signedURLs.length})`,
        );
    }

    const promises = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const signedURL = signedURLs[i];
        const stream = fs.createReadStream(file);
        const promise = axios.put(signedURL, stream, {
            headers: {
                "Content-Type": "application/octet-stream",
            },
        });
        promises.push(promise);
    }
    await Promise.all(promises);
};

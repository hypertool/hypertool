import type { GetSignedUrlConfig } from "@google-cloud/storage";

import { OAuth2Client } from "google-auth-library";
import { Storage } from "@google-cloud/storage";
import axios from "axios";

import * as constants from "./constants";

const {
    CLI_GOOGLE_CLIENT_ID,
    CLI_GOOGLE_CLIENT_SECRET,
    CLI_GOOGLE_REDIRECT_URI,
    WEB_GOOGLE_CLIENT_ID,
    WEB_GOOGLE_CLIENT_SECRET,
    API_SERVICE_ACCOUNT_PROJECT_ID,
    API_SERVICE_ACCOUNT_CLIENT_EMAIL,
    API_SERVICE_ACCOUNT_PRIVATE_KEY,
} = process.env;

const storage = new Storage({
    projectId: API_SERVICE_ACCOUNT_PROJECT_ID,
    credentials: {
        client_email: API_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: API_SERVICE_ACCOUNT_PRIVATE_KEY,
    },
});

const cliClient = new OAuth2Client({
    clientId: CLI_GOOGLE_CLIENT_ID,
    clientSecret: CLI_GOOGLE_CLIENT_SECRET,
    redirectUri: CLI_GOOGLE_REDIRECT_URI,
});

const webClient = new OAuth2Client({
    clientId: WEB_GOOGLE_CLIENT_ID,
    clientSecret: WEB_GOOGLE_CLIENT_SECRET,
});

/**
 * The `getUserInfo` utility function plays a central role in Google OAuth2
 * authentication. It accepts an authorization code returned from Google.
 * A combination of the authorization code and client secret is used to
 * fetch the access code. At this point, the OAuth2 protocol is completed.
 *
 * Finally, a request is sent to Google API (authorized by the access token)
 * to fetch the user info and returned to the caller.
 *
 * @param code
 * The authorization code returned from Google via the consent screen.
 *
 * @returns
 * The information of the user who authorized the application.
 */
export const getUserInfo = async (
    code: string,
    client: typeof constants.googleClientTypes[number]
): Promise<any> => {
    try {
        const credentials = await (client === "web"
            ? webClient
            : cliClient
        ).getToken(code);
        const result = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${credentials.tokens.access_token}`,
                },
            }
        );
        return result.data;
    } catch (error) {
        return null;
    }
};

export const generateUploadSignedURL = async (
    bucketName: string,
    fileName: string
): Promise<string> => {
    /* These options will allow temporary uploading of the file with outgoing
     * `Content-Type: application/octet-stream` header.
     */
    const options: GetSignedUrlConfig = {
        version: "v4",
        action: "write",
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
        contentType: "application/octet-stream",
    };

    const [url] = await storage
        .bucket(bucketName)
        .file(fileName)
        .getSignedUrl(options);

    /* You can use this URL with any user agent, for example:
     * ```
     * curl -X PUT -H 'Content-Type: application/octet-stream' --upload-file index.html <url>
     * ```
     */
    return url;
};

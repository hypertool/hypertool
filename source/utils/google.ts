import { OAuth2Client } from "google-auth-library";
import axios from "axios";

import * as constants from "./constants";

const cliClient = new OAuth2Client({
    clientId: process.env.CLI_GOOGLE_CLIENT_ID,
    clientSecret: process.env.CLI_GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.CLI_GOOGLE_REDIRECT_URI,
});

const webClient = new OAuth2Client({
    clientId: process.env.WEB_GOOGLE_CLIENT_ID,
    clientSecret: process.env.WEB_GOOGLE_CLIENT_SECRET,
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
const getUserInfo = async (
    code: string,
    client: typeof constants.googleClientTypes[number]
) => {
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

export { getUserInfo };

const { OAuth2Client } = require("google-auth-library");

const { GOOGLE_CLIENT_ID } = process.env;

const oauth2Client = new OAuth2Client();

const verifyToken = async (token: string) => {
    const ticket = await oauth2Client.verifyIdToken({
        idToken: token,
        audience: [GOOGLE_CLIENT_ID],
    });
    return ticket.getPayload();
};

export { verifyToken };
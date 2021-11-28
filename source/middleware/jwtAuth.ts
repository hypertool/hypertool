const httpStatus = require("../util/httpStatus");
const google = require("../util/google");

const jwtAuth = (request, response, next) => {

    const { authorization } = request.headers;

    if (!authorization) {
        response.status(httpStatus.FORBIDDEN).json({
            message: "Please provide an authorization token.",
        });
        return;
    }

    /* As of this writing, Express does not support asynchronous middleware. :(
     * Unleashing the doors of a miniature callback hell! Huzzah!
     */
    const token = authorization.split(" ")[1];
    google
        .verifyToken(token)
        .then((payload) => {
            const {
                given_name: firstName,
                family_name: lastName,
                picture: pictureURL,
                email_verified: emailVerified,
                email: emailAddress,
            } = payload;
            request.payload = {
                firstName,
                lastName,
                pictureURL,
                emailVerified,
                emailAddress,
            };
            next();
        })
        .catch(() => {
            response.status(httpStatus.FORBIDDEN).json({
                message: "The specified authorization token is invalid.",
            });
        });
};

module.exports = jwtAuth;
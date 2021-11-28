const httpStatus = require("../utils/constants");

const jwtAuth = (request, response, next) => {

    const { authorization } = request.headers;

    if (!authorization) {
        response.status(httpStatus.FORBIDDEN).json({
            message: "Please provide an authorization token.",
        });
        return;
    }

    const token = authorization.split(" ")[1];
    // verifyToken(token)
    //     .then((payload) => {
    //         const {
    //             given_name: firstName,
    //             family_name: lastName,
    //             picture: pictureURL,
    //             email_verified: emailVerified,
    //             email: emailAddress,
    //         } = payload;
    //         request.payload = {
    //             firstName,
    //             lastName,
    //             pictureURL,
    //             emailVerified,
    //             emailAddress,
    //         };
    //         next();
    //     })
    //     .catch(() => {
    //         response.status(httpStatus.FORBIDDEN).json({
    //             message: "The specified authorization token is invalid.",
    //         });
    //     });
};

module.exports = jwtAuth;
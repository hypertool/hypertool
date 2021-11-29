const { UserModel } = require("../models");
const { constants } = require("../utils");
const jwt = require("jsonwebtoken");

const jwtAuth = async (request, response, next) => {
    const { authorization } = request.headers;
    if (!authorization) {
        response.status(constants.httpStatuses.FORBIDDEN).json({
            message: "Please provide an authorization token.",
        });
        return;
    }

    const token = authorization.split(" ")[1];

    try {
        const { emailAddress } = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await UserModel.findOne({
            emailAddress,
        }).exec();
        request.user = user;
      } catch (err) {
        return response.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = jwtAuth;
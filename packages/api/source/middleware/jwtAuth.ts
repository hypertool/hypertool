import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { UserModel, constants } from "@hypertool/common";

const jwtAuth = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    const { authorization } = request.headers;
    if (!authorization) {
        response.status(constants.httpStatuses.FORBIDDEN).json({
            message: "Please provide an authorization token.",
        });
        return;
    }

    const token = authorization.split(" ")[1];

    try {
        const { emailAddress } = jwt.verify(
            token,
            process.env.JWT_SIGNATURE_KEY,
        );
        const user = await UserModel.findOne({
            emailAddress,
        }).exec();
        (request as any).user = user;
    } catch (error) {
        return response.status(401).send("The specified token is invalid.");
    }
    return next();
};

export default jwtAuth;

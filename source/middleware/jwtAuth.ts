import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UserModel } from '../models';
import { constants } from '../utils';

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
        const { emailAddress } = jwt.verify(token, process.env.JWT_SIGNATURE_KEY);
        const user = await UserModel.findOne({
            emailAddress,
        }).exec();
        request.user = user;
    } catch (error) {
        return response.status(401).send("The specified token is invalid.");
    }
    return next();
};

export { jwtAuth };
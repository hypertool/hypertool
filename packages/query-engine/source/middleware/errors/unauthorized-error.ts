import { constants } from "@hypertool/common";

import { NextFunction, Request, Response } from "express";

import { errorCodes } from "../../utils";

const { httpStatuses } = constants;

const unauthorizedError = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
        response.status(httpStatuses.UNAUTHORIZED).json({
            error: errorCodes[error.code],
            message: error.message,
        });
    } else {
        next(error);
    }
};

export default unauthorizedError;

import { constants } from "@hypertool/common";

import { NextFunction, Request, Response } from "express";

import { errorCodes } from "../../utils";

const { httpStatuses } = constants;

const badRequestError = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    if (error.code === "ER_BAD_HOST_ERROR") {
        response.status(httpStatuses.BAD_REQUEST).json({
            error: errorCodes[error.code],
            message: error.message,
        });
    } else {
        next(error);
    }
};

export default badRequestError;

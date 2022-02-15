import { NextFunction, Response, Request } from "express";
import { constants } from "@hypertool/common";

const { httpStatuses } = constants;

const badRequestError = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    if (error.code === "ER_BAD_HOST_ERROR") {
        response.status(httpStatuses.BAD_REQUEST).json({
            error: "Bad Host Request",
            message: error.message,
        });
    } else {
        next(error);
    }
};

export default badRequestError;

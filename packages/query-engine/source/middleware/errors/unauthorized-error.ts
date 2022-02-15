import { NextFunction, Response, Request } from "express";
import { constants } from "@hypertool/common";

const { httpStatuses } = constants;

const unauthorizedError = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
        response.status(httpStatuses.UNAUTHORIZED).json({
            error: "ACCESS_DENIED_ERROR",
            message: error.message,
        });
    } else {
        next(error);
    }
};

export default unauthorizedError;

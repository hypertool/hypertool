import { NextFunction, Response, Request } from "express";
import { constants } from "@hypertool/common";

const { httpStatuses } = constants;

const UnauthorizedError = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    response.status(httpStatuses.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: error.message,
    });
    next(error);
};

export default UnauthorizedError;

import { NextFunction, Response, Request } from "express";
import { constants } from "@hypertool/common";

const { httpStatuses } = constants;

const NotFoundError = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    response.status(httpStatuses.NOT_FOUND).json({
        error: "Not Found",
        message: error.message,
    });
    next(error);
};

export default NotFoundError;

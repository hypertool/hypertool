import { NextFunction, Response, Request } from "express";
import { constants } from "@hypertool/common";

const { httpStatuses } = constants;

const BadRequestError = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    response.status(httpStatuses.BAD_REQUEST).json({
        error: "Bad Request",
        message: error.message,
    });
    next(error);
};

export default BadRequestError;

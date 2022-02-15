import { NextFunction, Response, Request } from "express";
import { constants } from "@hypertool/common";

const { httpStatuses } = constants;

const notFoundError = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    if (
        error.code === "ER_BAD_DB_ERROR" ||
        error.code === "ER_BAD_TABLE_ERROR" ||
        error.code === "ER_NO_SUCH_TABLE"
    ) {
        response.status(httpStatuses.NOT_FOUND).json({
            error: "Not Found",
            message: error.message,
        });
    } else {
        next(error);
    }
};

export default notFoundError;

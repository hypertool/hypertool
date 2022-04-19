import { BadRequestError } from "@hypertool/common";

export class QueryExecutionError extends BadRequestError {
    errorCode: string;

    constructor(message: string, errorCode: string) {
        super(message);
        this.errorCode = errorCode;
    }
}

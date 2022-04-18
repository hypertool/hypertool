import { ApolloError } from "apollo-server-errors";

export default class ForbiddenError extends ApolloError {
    constructor(message: string) {
        super(message, "FORBIDDEN_ERROR");

        Object.defineProperty(this, "name", { value: "ForbiddenError" });
    }
}

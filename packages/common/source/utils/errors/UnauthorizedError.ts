import { ApolloError } from "apollo-server-errors";

export default class UnauthorizedError extends ApolloError {
    constructor(message: string) {
        super(message, "UNAUTHORIZED_ERROR");

        Object.defineProperty(this, "name", { value: "UnauthorizedError" });
    }
}

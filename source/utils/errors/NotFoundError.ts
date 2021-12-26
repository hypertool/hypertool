import { ApolloError } from "apollo-server-errors";

export default class NotFoundError extends ApolloError {
    constructor(message: string) {
        super(message, "NOT_FOUND_ERROR");

        Object.defineProperty(this, "name", { value: "NotFoundError" });
    }
}

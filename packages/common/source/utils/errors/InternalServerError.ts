import { ApolloError } from "apollo-server-errors";

export default class InternalServerError extends ApolloError {
    constructor(message: string) {
        super(message, "INTERNAL_SERVER_ERROR");

        Object.defineProperty(this, "name", { value: "InternalServerError" });
    }
}

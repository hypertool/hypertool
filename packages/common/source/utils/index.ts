import mongoose, { ClientSession } from "mongoose";

import { TTransactionCallback } from "../types";

export interface ObjectWithID {
    id?: string;
    _id?: mongoose.Types.ObjectId;
}

export const extractIds = (items: ObjectWithID[] | string[]): string[] => {
    if (items.length === 0) {
        return [];
    }

    if (typeof items[0] === "string") {
        return items as string[];
    }

    return (items as ObjectWithID[]).map((item: ObjectWithID) => {
        if (item instanceof mongoose.Types.ObjectId) {
            return item.toString();
        }
        return item.id || item._id?.toString();
    });
};

export const runAsTransaction = async <T>(
    callback: TTransactionCallback<T>,
): Promise<T> => {
    const session = await mongoose.startSession();
    let result: any;
    await session.withTransaction(async (client: ClientSession) => {
        result = await callback(client);
    });
    return result;
};

export * as constants from "./constants";
export * as google from "./google";
export * as session from "./session";
export { default as Client } from "./client";
export { default as PublicClient } from "./public-client";
export * from "./errors";

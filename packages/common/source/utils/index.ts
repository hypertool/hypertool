import mongoose from "mongoose";

export interface IObjectWithID {
    id?: string;
    _id?: mongoose.Types.ObjectId;
}

export const extractIds = (items: IObjectWithID[] | string[]): string[] => {
    if (items.length === 0) {
        return [];
    }

    if (typeof items[0] === "string") {
        return items as string[];
    }

    return (items as IObjectWithID[]).map((item: IObjectWithID) => {
        if (item instanceof mongoose.Types.ObjectId) {
            return item.toString();
        }
        return item.id || item._id?.toString();
    });
};

export const runAsTransaction = async (callback) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await callback();
        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export * as constants from "./constants";
export * as google from "./google";
export * as session from "./session";
export * as controller from "./controller";
export { default as Client } from "./client";
export { default as PublicClient } from "./public-client";
export * from "./errors";

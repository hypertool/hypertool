import mongoose from "mongoose";
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const INVITATION_JWT_SIGNATURE = process.env.INVITATION_JWT_SIGNATURE;
sgMail.setApiKey(SENDGRID_API_KEY);
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

export const sendEmail = async (emailAddress, subject, text, html) => {
    try {
        const message = {
            to: emailAddress,
            from: { name: "Hypertool", email: "noreply@hypertool.io" },
            subject,
            text,
            html,
        };

        await sgMail.send(message);
    } catch (error) {
        console.log(error.message);
    }
};

export * as constants from "./constants";
export * as google from "./google";
export * as session from "./session";
export { default as Client } from "./client";
export { default as PublicClient } from "./public-client";
export * from "./errors";

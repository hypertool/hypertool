import { BadRequestError } from "@hypertool/common";
import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (params) => {
    try {
        const { to, subject, text, html, from } = params;
        const message = {
            to,
            from,
            subject,
            text,
            html,
        };

        await sgMail.send(message);
    } catch (error) {
        throw new Error(error.message);
    }
};

export { default as createToken } from "./createToken";
export { default as hashPassword } from "./hashPassword";
export * from "./templates";

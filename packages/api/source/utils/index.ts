import { BadRequestError } from "@hypertool/common";
import sgMail from "@sendgrid/mail";
import { invitationTemplate } from "./templates";

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
        //console.log(res);
    } catch (error) {
        console.log(error.message);
        throw new BadRequestError(error.message);
    }
};

export { invitationTemplate };

import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (params: any): Promise<void> => {
    const { to, subject, text, html, from } = params;
    const message = {
        to,
        from,
        subject,
        text,
        html,
    };
    await sgMail.send(message);
};

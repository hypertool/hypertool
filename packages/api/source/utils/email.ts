import sgMail from "@sendgrid/mail";

export const sendEmail = async (params: any): Promise<void> => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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

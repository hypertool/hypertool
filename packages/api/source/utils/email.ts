import sgMail from "@sendgrid/mail";

import { createToken } from "./auth";
import { renderTemplate } from "./templates";

export const sendEmail = async (params: any): Promise<void> => {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn(
            "Cannot find SendGrid API key. Cancelling operation `sendEmail`.",
        );
        return;
    }

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

export const sendVerificationEmail = async (emailAddress: string) => {
    const token = createToken({ emailAddress }, "30m");
    const verificationURL = `${process.env.API_URL}/api/v1/users/verify/${token}`;
    const params = {
        from: { name: "Hypertool", email: "noreply@hypertool.io" },
        to: emailAddress,
        subject: "Verify your Hypertool email address",
        text: `Open the following link to validate your email address: ${verificationURL}`,
        html: await renderTemplate("verify-email.html", {
            verificationURL,
        }),
    };
    await sendEmail(params);
};

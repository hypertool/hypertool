import { promises as fs } from "fs";
import Mustache from "mustache";

const base = `${process.cwd()}/source/templates`;
const invitationTemplatePath = `${base}/invitation.html`;
const verifyEmailTemplatePath = `${base}/verify-email.html`;
const resetPasswordTemplatePath = `${base}/reset-password.html`;

export const invitationTemplate = async (data: any): Promise<string> => {
    const html = await fs.readFile(invitationTemplatePath, "utf8");
    return Mustache.render(html, data);
};

export const verifyEmailTemplate = async (data: any): Promise<string> => {
    const html = await fs.readFile(verifyEmailTemplatePath, "utf-8");
    return Mustache.render(html, data);
};

export const resetPasswordTemplate = async (data: any): Promise<string> => {
    const html = await fs.readFile(resetPasswordTemplatePath, "utf-8");
    return Mustache.render(html, data);
};

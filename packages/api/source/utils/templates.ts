import Mustache from "mustache";
import fs from "fs";

const fsPromisify = fs.promises;
const invitationTemplatePath = `${process.cwd()}/source/templates/invitation.html`;
const verifyEmailTemplatePath = `${process.cwd()}/source/templates/verifyEmail.html`;
const resetPasswordTemplatePath = `${process.cwd()}/source/templates/resetPassword.html`;

export const invitationTemplate = async (data) => {
    const html = await fsPromisify.readFile(invitationTemplatePath, "utf8");
    return Mustache.render(html, data);
};

export const verifyEmailTemplate = async (data) => {
    const html = await fsPromisify.readFile(verifyEmailTemplatePath, "utf-8");
    return Mustache.render(html, data);
};

export const resetPasswordTemplate = async (data) => {
    const html = await fsPromisify.readFile(resetPasswordTemplatePath, "utf-8");
    return Mustache.render(html, data);
};

import Mustache from "mustache";
import fs from "fs";

const fsPromisify = fs.promises;
const invitationTemplatePath = `${process.cwd()}/source/templates/invitation-template.html`;

export const invitationTemplate = async (data) => {
    const html = await fsPromisify.readFile(invitationTemplatePath, "utf8");
    return Mustache.render(html, data);
};

import Mustache from "mustache";
import fs from "fs";

const fsPromisify = fs.promises;
const filePath = `${process.cwd()}/source/templates/invitation-template.html`;

export const invitationTemplate = async (data) => {
    const str = await fsPromisify.readFile(filePath, "utf8");
    return Mustache.render(str, data);
};

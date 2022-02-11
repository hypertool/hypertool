import Mustache from "mustache";
import fs from "fs";

const fsPromisify = fs.promises;

export const invitationTemplate = async (data) => {
    const str = await fsPromisify.readFile(
        "../templates/invitation-template.html",
    );
    return Mustache.render(str, data);
};

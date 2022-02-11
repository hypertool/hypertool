import Mustache from "mustache";

const fs = require("fs").promises;

export const invitationTemplate = async (data) => {
    const str = await fs.readFile("../templates/invitation-template.html");
    return Mustache.render(str, data);
};

import { promises as fs } from "fs";
import Mustache from "mustache";

/* The base path should be WRT to the build directory, not this file. */
const base = `${process.cwd()}/templates`;

export const renderTemplate = async (
    name: string,
    data: any,
): Promise<string> => {
    const path = `${base}/${name}`;
    const template = await fs.readFile(path, "utf-8");
    return Mustache.render(template, data);
};

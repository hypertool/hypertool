import yaml from "js-yaml";
import { glob } from "glob";
import fs from "fs";

import { paths } from "../utils";

const compile = () => {
    glob(
        paths.MANIFEST_DIRECTORY + "/**/*.{yml, yaml}",
        async (error: Error | null, files: string[]) => {
            const promises: Promise<string>[] = files.map((file) =>
                fs.promises.readFile(file, "utf-8"),
            );
            const result: string[] = await Promise.all(promises);
            console.log(result.map((item) => yaml.load(item)));
        },
    );
};

export default compile;

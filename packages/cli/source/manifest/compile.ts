import yaml from "js-yaml";
import { glob } from "glob";
import fs from "fs";

import * as paths from "../config/paths";

const compile = () => {
    glob(
        paths.MANIFEST_DIRECTORY + "**/*.{yml, yaml}",
        (error: Error | null, files: string[]) => {
            files.forEach((file) => {
                const loaded = yaml.load(fs.readFileSync(file, "utf8"));
                console.log(loaded);
            });
        },
    );
};

export default compile;

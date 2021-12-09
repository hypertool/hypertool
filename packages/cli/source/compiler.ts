import type { Configuration, Compiler } from "webpack";

import webpack from "webpack";

import { logger } from "./utils";

export const prepare = (): Configuration => {
    return {
        mode: "development",
        entry: "./source/index.js",
        infrastructureLogging: {
            level: "none",
        },
        stats: "none",
    };
};

export const createCompiler = (): Compiler => {
    const configuration = prepare();
    try {
        const compiler = webpack(configuration);
        return compiler;
    } catch (error: any) {
        logger.error("Failed to compile");
        logger.error(error.message);
        process.exit(1);
    }
};

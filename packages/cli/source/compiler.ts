import type { Configuration, Compiler } from "webpack";

import webpack from "webpack";
import crypto from "crypto";

import { logger } from "./utils";
import * as paths from "./config/paths";

const hash = (data: any) => {
    const hash = crypto.createHash("md5");
    hash.update(JSON.stringify(data));
    return hash.digest("hex");
};

export const prepare = (production: boolean): Configuration => {
    return {
        mode: production ? "production" : "development",
        /* Stop compilation early when building for production. */
        bail: production,
        /* The entry point of the application. This is where Webpack starts building
         * the dependency graph.
         */
        entry: paths.APP_ENTRY,
        output: {
            path: paths.BUILD_DIRECTORY,
            pathinfo: !production,
        },
        infrastructureLogging: {
            level: "none",
        },
        stats: "none",
        cache: {
            type: "filesystem",
            version: hash({
                firstName: "Bruce",
                lastName: "Wayne",
                heroNames: ["Batman", "The Dark Knight"],
            }),
            cacheDirectory: paths.CACHE_DIRECTORY,
            store: "pack",
            buildDependencies: {
                defaultWebpack: ["webpack/lib/"],
                config: [__filename],
                // Add `tsconfig` once TypeScript is supported.
            },
        },
    };
};

export const createCompiler = (production: boolean): Compiler => {
    const configuration = prepare(production);
    try {
        const compiler = webpack(configuration);
        return compiler;
    } catch (error: any) {
        logger.error("Failed to compile");
        logger.error(error.message);
        process.exit(1);
    }
};

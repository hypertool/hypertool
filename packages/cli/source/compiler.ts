import type { Configuration, Compiler } from "webpack";

import webpack from "webpack";

export const prepare = (): Configuration => {
    return {
        mode: "development",
        entry: "./source/index.js",
    };
};

export const createCompiler = (): Compiler => {
    const configuration = prepare();
    const compiler = webpack(configuration);
    return compiler;
};

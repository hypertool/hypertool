import path from "path";
import { Compiler } from "webpack";
import { DefinePlugin } from "webpack";

import { listFiles, paths } from "../utils";

export const findRoutes = async () => {
    const absolutePaths = await listFiles(
        `${paths.SCREENS_DIRECTORY}/**/*.{js,jsx,ts,tsx}`,
    );
    const routes = absolutePaths.map((absolutePath) => ({
        path: path.relative(paths.APP_DIRECTORY, absolutePath),
        uri:
            "/" +
            path
                .relative(paths.SCREENS_DIRECTORY, absolutePath)
                // Remove file extensions
                .replace(/\.(js|ts|jsx|tsx)$/, "")
                // Remove "/index" from paths like `*/index`
                .replace(/\/index$/, "")
                // Replace "index" with ""
                .replace(/^index$/, ""),
    }));
    return routes;
};

const prepareHypertool = (routes: any[]) => {
    const hypertool: any = {
        routes,
    };
    const result = Object.keys(hypertool).reduce(
        (carryOver: any, key: string) => {
            carryOver[key] = JSON.stringify(hypertool[key]);
            return carryOver;
        },
        {},
    );
    return result;
};

export default class DefineHypertoolPlugin {
    apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapAsync(
            "DefineHypertoolPlugin",
            (_compilation: unknown, callback) => {
                findRoutes().then((routes: any) => {
                    const definePlugin = new DefinePlugin({
                        "window.hypertool": prepareHypertool(routes),
                    });
                    definePlugin.apply(compiler);
                    callback();
                });
            },
        );
    }
}

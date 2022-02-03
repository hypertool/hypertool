import type { Manifest, Session } from "@hypertool/common";

import { Compiler } from "webpack";
import path from "path";

import type { Route } from "../types";

import { paths, listFiles } from "../utils";
import { DefinePlugin } from "webpack";

export const findRoutes = async (): Promise<Route[]> => {
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

const stripManifest = (manifest: Manifest) => {
    // TODO: Inject manifest.values only.
    return {};
};

const prepareHypertool = (
    routes: Route[],
    manifest: Manifest,
    session: Session,
) => {
    const strippedManifest = stripManifest(manifest);
    const hypertool: any = {
        routes,
        manifest: strippedManifest,
        session,
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
    manifest?: Manifest;
    session?: Session;

    constructor(manifest: Manifest, session: Session) {
        this.manifest = manifest;
        this.session = session;
    }

    apply(compiler: Compiler) {
        compiler.hooks.beforeCompile.tapAsync(
            "DefineHypertoolPlugin",
            (_compilation: unknown, callback) => {
                async () => {
                    const routes = await findRoutes();
                    const definePlugin = new DefinePlugin({
                        "window.hypertool": prepareHypertool(
                            routes,
                            <Manifest>this.manifest,
                            <Session>this.session,
                        ),
                    });
                    definePlugin.apply(compiler);
                    callback();
                };
            },
        );
    }
}

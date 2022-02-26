/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * Copyright (c) 2021-present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from "fs";
import path from "path";

import * as paths from "./paths";
import { truthy } from ".";

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve("./paths")];

export const loadEnv = () => {
    const { NODE_ENV } = process.env;
    if (!NODE_ENV) {
        throw new Error(
            "The `NODE_ENV` environment variable is required but was not specified.",
        );
    }

    // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
    const files = [
        `${paths.DOT_ENV}.${NODE_ENV}.local`,
        /* Do not include `.env.local` for `test` environment since normally you
         * expect tests to produce the same results for everyone.
         */
        NODE_ENV !== "test" && `${paths.DOT_ENV}.local`,
        `${paths.DOT_ENV}.${NODE_ENV}`,
        paths.DOT_ENV,
    ].filter(truthy);

    /* Load the environment variables from .env* files. Suppress warnings using silent
     * if this file is missing. `dotenv` will never modify any environment variables
     * that have already been set. Variable expansion is supported in .env files.
     * https://github.com/motdotla/dotenv
     * https://github.com/motdotla/dotenv-expand
     */
    for (const file of files) {
        if (fs.existsSync(file)) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require("dotenv-expand")(
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require("dotenv").config({
                    path: file,
                }),
            );
        }
    }

    /* We support resolving modules according to `NODE_PATH`.
     * This lets you use absolute paths in imports inside large monorepos:
     * https://github.com/facebook/create-react-app/issues/253.
     *
     * It works similar to `NODE_PATH` in Node itself:
     * https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
     *
     * Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
     * Otherwise, we risk importing Node.js core modules into an app instead of
     * webpack shims.
     *
     * https://github.com/facebook/create-react-app/issues/1023#issuecomment-265344421
     * We also resolve them to make sure all tools using them work consistently.
     */
    process.env.NODE_PATH = (process.env.NODE_PATH || "")
        .split(path.delimiter)
        .filter((folder) => folder && !path.isAbsolute(folder))
        .map((folder) => path.resolve(paths.APP_DIRECTORY, folder))
        .join(path.delimiter);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Env = { [key: string]: any };

/* Create a copy of `NODE_ENV`, `REACT_APP_*`, `HT_*` environment
 * variables. The copy will be injected into the application via `DefinePlugin`
 * in webpack configuration.
 */
export const getClientEnvironment = (
    publicUrl: string,
    environment: "production" | "development" | "test" = "development",
) => {
    const raw = Object.keys(process.env)
        .filter((key) => key.startsWith("REACT_APP_") || key.startsWith("HT_"))
        .reduce(
            (env: Env, key: string) => {
                env[key] = process.env[key];
                return env;
            },
            {
                /* Useful for determining whether we’re running in production mode.
                 * Most importantly, it switches React into the correct mode.
                 */
                NODE_ENV: environment,

                /* Useful for resolving the correct path to static assets in `public`.
                 * For example, `<img src={process.env.PUBLIC_URL + '/img/logo.png'} />`.
                 * This should only be used as an escape hatch. Normally you would put
                 * images inside `source` and `import` them in code to get their paths.
                 */
                PUBLIC_URL: publicUrl,

                /* We support configuring the sockjs pathname during development.
                 * These settings let a developer run multiple simultaneous projects.
                 * They are used as the connection `hostname`, `pathname` and `port`
                 * in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
                 * and `sockPort` options in webpack-dev-server.
                 */
                WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
                WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
                WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,

                /* Whether or not react-refresh is enabled.
                 * It is defined here so it is available in the webpackHotDevClient.
                 */
                FAST_REFRESH: process.env.FAST_REFRESH !== "false",
            },
        );

    /* Stringify all values so we can feed into webpack `DefinePlugin`. */
    const stringified = {
        "process.env": Object.keys(raw).reduce((env: Env, key: string) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {}),
    };

    return { raw, stringified };
};

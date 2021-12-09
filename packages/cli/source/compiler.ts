/**
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 * Copyright (c) 2015 - present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Configuration, Compiler } from "webpack";

import webpack from "webpack";
import crypto from "crypto";
import HtmlWebpackPlugin from "html-webpack-plugin";

import { logger /* ModuleScopePlugin */ } from "./utils";
import * as paths from "./config/paths";

const hash = (data: any) => {
    const hash = crypto.createHash("md5");
    hash.update(JSON.stringify(data));
    return hash.digest("hex");
};

const IMAGE_INLINE_SIZE_LIMIT = 10000;

export const prepare = (production: boolean): Configuration => {
    const enableTypeScript = false;
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
        resolve: {
            modules: [paths.NODE_MODULES_DIRECTORY],
            extensions: paths.extensions
                .filter(
                    (extension: string) =>
                        enableTypeScript || extension !== "ts",
                )
                .map((extension: string) => "." + extension),
            // plugins: [
            //     new ModuleScopePlugin(paths.APP_SOURCE_DIRECTORY, [
            //         paths.PACKAGE_DESCRIPTOR,
            //     ]),
            // ],
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    oneOf: [
                        /* "url" loader works like "file" loader except that it embeds assets
                         * smaller than specified limit in bytes as data URLs to avoid requests.
                         * A missing `test` is equivalent to a match.
                         */
                        {
                            test: [
                                /\.bmp$/,
                                /\.gif$/,
                                /\.jpe?g$/,
                                /\.png$/,
                                /\.avif$/,
                            ],
                            type: "asset",
                            parser: {
                                dataUrlCondition: {
                                    maxSize: IMAGE_INLINE_SIZE_LIMIT,
                                },
                            },
                        },
                        {
                            test: /\.svg$/,
                            use: [
                                {
                                    loader: require.resolve("@svgr/webpack"),
                                    options: {
                                        prettier: false,
                                        svgo: false,
                                        svgoConfig: {
                                            plugins: [{ removeViewBox: false }],
                                        },
                                        titleProp: true,
                                        ref: true,
                                    },
                                },
                                {
                                    loader: require.resolve("file-loader"),
                                    options: {
                                        name: "static/media/[name].[hash].[ext]",
                                    },
                                },
                            ],
                            issuer: {
                                and: [/\.(ts|js)$/],
                            },
                        },
                        {
                            test: /\.(js|ts)$/,
                            include: paths.APP_SOURCE_DIRECTORY,
                            loader: require.resolve("babel-loader"),
                            options: {
                                customize: require.resolve(
                                    "babel-preset-react-app/webpack-overrides",
                                ),
                                presets: [
                                    [
                                        require.resolve(
                                            "babel-preset-react-app",
                                        ),
                                        {
                                            runtime: "automatic",
                                        },
                                    ],
                                ],
                                babelrc: false,
                                configFile: false,
                                /* This is a feature of `babel-loader` for webpack (not Babel itself).
                                 * It enables caching results in ./node_modules/.cache/babel-loader
                                 * directory for faster rebuilds.
                                 */
                                cacheDirectory: true,
                                cacheCompression: false,
                                compact: production,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            /* Generate an index file and inject a script loader. */
            new HtmlWebpackPlugin({
                inject: true,
                template: paths.APP_HTML,
                ...(production
                    ? {
                          minify: {
                              removeComments: true,
                              collapseWhitespace: true,
                              removeRedundantAttributes: true,
                              useShortDoctype: true,
                              removeEmptyAttributes: true,
                              removeStyleLinkTypeAttributes: true,
                              keepClosingSlash: true,
                              minifyJS: true,
                              minifyCSS: true,
                              minifyURLs: true,
                          },
                      }
                    : {}),
            }),
        ],
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

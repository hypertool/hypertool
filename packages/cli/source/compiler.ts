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
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { getLocalIdentifier, logger, truthy } from "./utils";
import { env, paths } from "./utils";
import {
    DefineHypertoolPlugin,
    InterpolateHtmlPlugin /* ModuleScopePlugin */,
} from "./plugins";

const hash = (data: any) => {
    const hash = crypto.createHash("md5");
    hash.update(JSON.stringify(data));
    return hash.digest("hex");
};

const IMAGE_INLINE_SIZE_LIMIT = 10000;

export const prepare = (
    environment: "production" | "development" | "test",
): Configuration => {
    const production = environment === "production";
    const development = environment === "development";
    const test = environment === "test";
    const enableTypeScript = false;
    const enableSourceMap = false;
    const clientEnv = env.getClientEnvironment(
        paths.PUBLIC_URL_OR_PATH.slice(0, -1),
    );
    /* Source map is always enabled in development. */
    const sourceMap = production ? enableSourceMap : development;

    /* PostCSS loader applies autoprefixer to our CSS.
     * CSS loader resolves paths in CSS and adds assets as dependencies.
     * Style loader turns CSS into JS modules that inject `<style>` tags.
     * In production, we use `MiniCSSExtractPlugin` to extract that CSS
     * to a file, but in development style loader enables hot editing
     * of CSS.
     */
    const getStyleLoaders = (options: any, preprocessor?: string) => {
        const loaders = [
            development && require.resolve("style-loader"),
            production && {
                loader: MiniCssExtractPlugin.loader,
                /* CSS is located in `static/css`, use '../../' to locate `index.html`
                 * directory in production `paths.PUBLIC_URL_OR_PATH` can be a
                 * relative path.
                 */
                options: {
                    publicPath: paths.PUBLIC_URL_OR_PATH.startsWith(".")
                        ? "../.."
                        : undefined,
                },
            },
            {
                loader: require.resolve("css-loader"),
                options,
            },
            {
                /* Options for PostCSS as we reference these options twice.
                 * Adds vendor prefixing based on your specified browser support in
                 * package.json.
                 */
                loader: require.resolve("postcss-loader"),
                options: {
                    postcssOptions: {
                        /* Necessary for external CSS imports to work
                         * https://github.com/facebook/create-react-app/issues/2677
                         */
                        ident: "postcss",
                        plugins: [
                            "postcss-flexbugs-fixes",
                            [
                                "postcss-preset-env",
                                {
                                    autoprefixer: {
                                        flexbox: "no-2009",
                                    },
                                    stage: 3,
                                },
                            ],
                            /* Adds PostCSS Normalize as the reset css with default options,
                             * so that it honors browserslist config in `package.json`
                             * which in turn let's users customize the target behavior as per
                             * their needs.
                             */
                            "postcss-normalize",
                        ],
                    },
                    sourceMap,
                },
            },
        ].filter(truthy);

        if (preprocessor) {
            loaders.push(
                {
                    loader: require.resolve("resolve-url-loader"),
                    options: {
                        sourceMap,
                        root: paths.APP_SOURCE_DIRECTORY,
                    },
                },
                {
                    loader: require.resolve(preprocessor),
                    options: {
                        sourceMap: true,
                    },
                },
            );
        }
        return loaders;
    };

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
            pathinfo: development,
        },
        infrastructureLogging: {
            level: "none",
        },
        stats: "none",
        cache: {
            type: "filesystem",
            version: hash(clientEnv.raw),
            cacheDirectory: paths.CACHE_DIRECTORY,
            store: "pack",
            buildDependencies: {
                defaultWebpack: ["webpack/lib/"],
                config: [__filename],
                // Add `tsconfig` once TypeScript is supported.
            },
        },
        // resolve: {
        //     modules: [paths.NODE_MODULES_DIRECTORY],
        //     extensions: paths.extensions
        //         .filter(
        //             (extension: string) =>
        //                 enableTypeScript || extension !== "ts",
        //         )
        //         .map((extension: string) => "." + extension),
        //     // plugins: [
        //     //     new ModuleScopePlugin(paths.APP_SOURCE_DIRECTORY, [
        //     //         paths.PACKAGE_DESCRIPTOR,
        //     //     ]),
        //     // ],
        // },
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
                        /* In Hypertool, when a .css file is imported, it is
                         * imported via CSS Modules (https://github.com/css-modules/css-modules).
                         * This allows global style pollution.
                         */
                        {
                            test: /\.css$/,
                            exclude: /\.global\.css$/,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap,
                                modules: {
                                    mode: "local",
                                    getLocalIdent: getLocalIdentifier,
                                },
                            }),
                        },
                        {
                            /* By default CSS files are imported as CSS modules.
                             * This allows styles to be local within components
                             * and prevents global style pollution.
                             *
                             * Developers can override this behavior and import
                             * CSS files into the global scope by naming their
                             * stylesheets with `.global.css` extension.
                             */
                            test: /\.global\.css$/,
                            use: getStyleLoaders({
                                importLoaders: 1,
                                sourceMap,
                                modules: {
                                    mode: "icss",
                                },
                            }),
                            /* Do not consider CSS imports dead code even if the
                             * containing package claims to have no side effects.
                             * Remove this when webpack adds a warning or an error
                             * for this.
                             *
                             * See https://github.com/webpack/webpack/issues/6571
                             */
                            sideEffects: true,
                        },
                    ],
                },
            ],
        },
        plugins: [
            new DefineHypertoolPlugin(),
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
            /* Makes some environment variables available in `index.html`.
             * The public URL is available as `%PUBLIC_URL%` in `index.html`.
             *
             * For example:
             * ```html
             * <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
             * ```
             *
             * It will be an empty string unless you specify "homepage"
             * in `package.json`, in which case it will be the pathname of
             * that URL.
             */
            new InterpolateHtmlPlugin(clientEnv.raw),
            /* Injects environment variables derived from `getClientEnvironment()`
             * to the application.
             *
             * You can using the environment varaible as shown below:
             * ```
             * if (process.env.NODE_ENV === "production") {
             *     ...
             * }
             * ```
             *
             * It is absolutely essential that `NODE_ENV` is set to "production"
             * during a production build. Otherwise React will be compiled in
             * the very slow development mode.
             */
            new webpack.DefinePlugin(clientEnv.stringified),

            /* Watcher doesn't work well if you mistype casing in a path so we use
             * a plugin that prints an error when you attempt to do this.
             * See https://github.com/facebook/create-react-app/issues/240
             */
            development && new CaseSensitivePathsPlugin(),
        ].filter(truthy) as any,
    };
};

export const createCompiler = (
    environment: "production" | "development" | "test",
): Compiler => {
    const configuration = prepare(environment);
    try {
        const compiler = webpack(configuration);
        return compiler;
    } catch (error: any) {
        logger.error("Failed to compile");
        logger.error(error.message);
        process.exit(1);
    }
};

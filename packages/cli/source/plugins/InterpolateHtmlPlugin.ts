/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * Copyright (c) 2021-present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The `InterpolateHtmlPlugin` webpack plugin lets us interpolate custom
 * variables into `index.html`. It works in tandem with HtmlWebpackPlugin.
 *
 * Usage:
 * ```
 * new InterpolateHtmlPlugin(HtmlWebpackPlugin, { 'MY_VARIABLE': 42 })
 * ```
 * Then, you can use %MY_VARIABLE% in your `index.html`.
 *
 * Learn more about creating plugins like this:
 * https://github.com/ampedandwired/html-webpack-plugin#events
 */

import type { Compiler } from "webpack";

import HtmlWebpackPlugin from "html-webpack-plugin";

import { escapeStringRegexp } from "../utils";

type Replacements = {
    [key: string]: string;
};

class InterpolateHtmlPlugin {
    replacements: Replacements;

    constructor(replacements: Replacements) {
        this.replacements = replacements;
    }

    apply(compiler: Compiler) {
        compiler.hooks.compilation.tap(
            "InterpolateHtmlPlugin",
            (compilation) => {
                HtmlWebpackPlugin.getHooks(
                    compilation,
                ).afterTemplateExecution.tap(
                    "InterpolateHtmlPlugin",
                    (data: any): any => {
                        /* Run HTML through a series of user-specified string
                         * replacements.
                         */
                        Object.keys(this.replacements).forEach((key) => {
                            const value = this.replacements[key];
                            data.html = data.html.replace(
                                new RegExp(
                                    "%" + escapeStringRegexp(key) + "%",
                                    "g",
                                ),
                                value,
                            );
                        });
                    },
                );
            },
        );
    }
}

export default InterpolateHtmlPlugin;

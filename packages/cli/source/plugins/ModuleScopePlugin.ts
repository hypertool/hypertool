/**
 * Copyright (c) 2015 - present, Facebook, Inc.
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk from "chalk";
import path from "path";
import os from "os";

class ModuleScopePlugin {
    allowedDirectories: string[];
    allowedFiles: Set<string>;
    allowedPaths: string[];

    constructor(allowedDirectories: string, allowedFiles: string[] = []) {
        this.allowedDirectories = Array.isArray(allowedDirectories)
            ? allowedDirectories
            : [allowedDirectories];
        this.allowedFiles = new Set(allowedFiles);
        this.allowedPaths = [...allowedFiles]
            .map(path.dirname)
            .filter((p) => path.relative(p, process.cwd()) !== "");
    }

    apply(resolver: any) {
        const { allowedDirectories, allowedFiles, allowedPaths } = this;
        console.log(resolver);
        resolver.hooks.file.tapAsync(
            "ModuleScopePlugin",
            (request: any, contextResolver: any, callback: any) => {
                /* Unknown issuer, probably webpack internals */
                if (!request.context.issuer) {
                    return callback();
                }

                if (
                    /* If this resolves to `node_module`, we do not care what
                     * happens next.
                     */
                    request.descriptionFileRoot.indexOf("/node_modules/") !==
                        -1 ||
                    request.descriptionFileRoot.indexOf("\\node_modules\\") !==
                        -1 ||
                    /* Make sure this request was manual. */
                    !request.__innerRequest_request
                ) {
                    return callback();
                }

                /* Resolve the issuer from `allowedDirectories` and make sure it
                 * is one of our files
                 *
                 * Is `indexOf === 0` better?
                 */
                if (
                    allowedDirectories.every((allowedDirectory) => {
                        const relative = path.relative(
                            allowedDirectory,
                            request.context.issuer,
                        );
                        /* If it is not inside an allowed directory, not our request! */
                        return (
                            relative.startsWith("../") ||
                            relative.startsWith("..\\")
                        );
                    })
                ) {
                    return callback();
                }

                const requestFullPath = path.resolve(
                    path.dirname(request.context.issuer),
                    request.__innerRequest_request,
                );
                if (allowedFiles.has(requestFullPath)) {
                    return callback();
                }

                if (
                    allowedPaths.some((allowedFile) => {
                        return requestFullPath.startsWith(allowedFile);
                    })
                ) {
                    return callback();
                }

                /* Find path from source to the requested file.
                 * Error if in a parent directory of all given allowed directories.
                 */
                if (
                    allowedDirectories.every((allowedDirectory) => {
                        const requestRelative = path.relative(
                            allowedDirectory,
                            requestFullPath,
                        );
                        return (
                            requestRelative.startsWith("../") ||
                            requestRelative.startsWith("..\\")
                        );
                    })
                ) {
                    const scopeError = new Error(
                        `You attempted to import ${chalk.cyan(
                            request.__innerRequest_request,
                        )} which falls outside of the project ${chalk.cyan(
                            "source/",
                        )} directory. ` +
                            `Relative imports outside of ${chalk.cyan(
                                "source/",
                            )} are not supported.` +
                            os.EOL +
                            `You can either move it inside ${chalk.cyan(
                                "source/",
                            )}, or add a symlink to it from project's ${chalk.cyan(
                                "node_modules/",
                            )}.`,
                    );
                    Object.defineProperty(scopeError, "__module_scope_plugin", {
                        value: true,
                        writable: false,
                        enumerable: false,
                    });
                    callback(scopeError, request);
                } else {
                    callback();
                }
            },
        );
    }
}

export default ModuleScopePlugin;

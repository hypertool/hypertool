/**
 * Copyright (c) 2015 - present, Facebook, Inc.
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 * Copyright (c) 2014 - present, Sindre Sorhus <sindresorhus@gmail.com>
 *                               (https://sindresorhus.com)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk from "chalk";
import { execSync } from "child_process";
import { execFileSync } from "child_process";
import path from "path";
import { Socket } from "net";
import loaderUtils from "loader-utils";
import glob from "glob";

const execOptions = {
    encoding: "utf8",
    stdio: [
        "pipe", // stdin (default)
        "pipe", // stdout (default)
        "ignore", //stderr
    ],
};

const isReactApp = (processCommand: string) => {
    return /^node .*react-scripts\/scripts\/start\.js\s?$/.test(processCommand);
};

const getProcessIdOnPort = (port: number) => {
    return execFileSync(
        "lsof",
        [`-i:${port}`, "-P", "-t", "-sTCP:LISTEN"],
        execOptions as any,
    )
        .split("\n")[0]
        .trim();
};

const getPackageNameInDirectory = (directory: string) => {
    const packagePath = path.join(directory.trim(), "package.json");

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require(packagePath).name;
    } catch (error) {
        return null;
    }
};

const getProcessCommand = (processId: string, processDirectory: string) => {
    const oldCommand = execSync(
        `ps -o command -p ${processId} | sed -n 2p`,
        execOptions as any,
    );

    const command = oldCommand.replace(/\n$/, "");

    if (isReactApp(command)) {
        const packageName = getPackageNameInDirectory(processDirectory);
        return packageName ? packageName : command;
    } else {
        return command;
    }
};

const getDirectoryOfProcessById = (processId: string) => {
    return execSync(
        "lsof -p " +
            processId +
            ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
        execOptions as any,
    ).trim();
};

export const getProcessForPort = (port: number) => {
    try {
        const processId = getProcessIdOnPort(port);
        const directory = getDirectoryOfProcessById(processId);
        const command = getProcessCommand(processId, directory);
        return (
            chalk.cyan(command) +
            chalk.grey(" (pid " + processId + ")\n") +
            chalk.blue("  in ") +
            chalk.cyan(directory)
        );
    } catch (error) {
        return null;
    }
};

export const isPortAvailable = (port: number): Promise<boolean> =>
    new Promise((resolve, reject) => {
        const socket = new Socket();

        const timeout = () => {
            resolve(true);
            socket.destroy();
        };
        setTimeout(timeout, 200);
        socket.on("timeout", timeout);

        socket.on("connect", function () {
            resolve(false);
            socket.destroy();
        });

        socket.on("error", function (error: any) {
            if (error.code !== "ECONNREFUSED") {
                reject(error);
            }
            resolve(true);
        });

        socket.connect(port, "0.0.0.0");
    });

export const isRoot = () => process.getuid && process.getuid() === 0;

export type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T;

export const truthy = <T>(value: T): value is Truthy<T> => {
    return !!value;
};

/**
 * Escape `RegExp` special characters.
 * You can also use this to escape a string that is inserted into the middle of
 * a regex, for example, into a character class.
 *
 * @example
 * ```
 * const escapedString = escapeStringRegexp('How much $ for a 🦄?');
 * // escapedString = 'How much \\$ for a 🦄\\?'
 * new RegExp(escapedString);
 * ```
 */
export const escapeStringRegexp = (value: string): string => {
    /* Escape characters with special meaning either inside or outside character
     * sets. Use a simple backslash escape when it’s always valid, and a `\xnn`
     * escape when the simpler form would be disallowed by Unicode patterns’
     * stricter grammar.
     */
    return value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
};

export const getLocalIdentifier = (
    context: any,
    _localIdentifierName: string,
    localName: string,
    options: any,
) => {
    /* Use the file name or directory name, based on some uses the `index.js`
     * / index.(css|scss|sass) project style
     */
    const fileOrDirectoryName = context.resourcePath.match(
        /index\.(css|scss|sass)$/,
    )
        ? "[folder]"
        : "[name]";
    /* Create a hash based on a the file location and class name. Will be unique
     * across a project, and close to globally unique.
     */
    const hash = loaderUtils.getHashDigest(
        Buffer.from(
            path.posix.relative(context.rootContext, context.resourcePath) +
                localName,
            "utf-8",
        ),
        "md5",
        "base64",
        5,
    );
    /* Use `loaderUtils` to find the file or directory name. */
    const className = loaderUtils.interpolateName(
        context,
        fileOrDirectoryName + "__" + localName + "__" + hash,
        options,
    );

    return className;
};

export const listFiles = (pattern: string): Promise<string[]> =>
    new Promise((resolve, reject) => {
        glob(pattern, {}, (error: Error | null, matches: string[]) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(matches);
        });
    });
export const getMissingKeys = (array: string[], registry: any) => {
    const keys: string[] = [];
    for (const key of array) {
        if (!Object.prototype.hasOwnProperty.call(registry, key)) {
            keys.push(key);
        }
    }
    return keys.length === 0 ? null : keys;
};

export * as logger from "./logger";
export * as env from "./env";
export * as paths from "./paths";
export * as constants from "./constants";
export { default as ModuleScopePlugin } from "../plugins/ModuleScopePlugin";

/**
 * Copyright (c) 2015 - present, Facebook, Inc.
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk from "chalk";
import { execSync } from "child_process";
import { execFileSync } from "child_process";
import path from "path";
import { Socket } from "net";

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

export * as logger from "./logger";
export * as env from "./env";
export * as paths from "./paths";
export { default as ModuleScopePlugin } from "./ModuleScopePlugin";

import type { Stats, Configuration as CompilerConfiguration } from "webpack";
import type { Configuration as ServerConfiguration } from "webpack-dev-server";

import prompts from "prompts";
import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import portFinder from "portfinder";

import { getProcessForPort, isPortAvailable, isRoot } from "./utils";

export interface DevConfiguration {
    compiler: CompilerConfiguration;
    server: ServerConfiguration;
}

interface CommandConfiguration {
    port: number;
    autoPort: boolean;
}

export const prepareConfiguration = async (
    configuration: CommandConfiguration,
): Promise<DevConfiguration> => {
    const { port } = configuration;

    let availablePort = port;
    let newPortRequired = false;
    if (port < 1024 && process.platform !== "win32" && !isRoot()) {
        console.log(
            "Root permission is required to listen on ports below 1024.",
        );
        newPortRequired = true;
        /* We may try to find the next available port below. Therefore, skip all the
         * ports that require root permission.
         */
        availablePort = 1024;
    } else if (!(await isPortAvailable(port))) {
        const processForPort =
            getProcessForPort(port) ||
            "Could not find the process using the port.";
        console.log(
            `A process is already listening on port ${port}.\n${processForPort}`,
        );
        newPortRequired = true;
    }

    if (newPortRequired) {
        const shouldFind =
            configuration.autoPort ||
            (
                await prompts({
                    message: `Would you like to use another port instead?`,
                    name: "find",
                    type: "confirm",
                    initial: true,
                })
            ).find;

        if (!shouldFind) {
            console.log(
                "Cannot proceed further without a listenable port. Terminating.",
            );
            process.exit(0);
        }

        availablePort = await portFinder.getPortPromise({
            port: availablePort,
        });

        console.log(
            `Port ${availablePort} is available. Hypertool will try to use it.`,
        );
    }

    return {
        compiler: {
            mode: "development",
            entry: "./source/index.js",
        },
        server: {
            static: {
                directory: path.join(process.cwd(), "dist"),
            },
            compress: true,
            port: availablePort,
        },
    };
};

export const startServer = async (
    configuration: DevConfiguration,
): Promise<void> => {
    const compiler = webpack(configuration.compiler);
    compiler.watch(
        {
            aggregateTimeout: 600,
            ignored: "**/node_modules",
            poll: false,
        },
        (error?: Error, stats?: Stats) => {
            if (error) {
                console.log(error);
                return;
            }

            if (stats) {
                console.log(
                    stats.toString({
                        chunks: false,
                        colors: true,
                    }),
                );
                return;
            }

            console.log(stats);
        },
    );

    const server = new WebpackDevServer(
        { ...configuration.server, open: true },
        compiler,
    );

    console.log("Starting server...");
    await server.start();
};

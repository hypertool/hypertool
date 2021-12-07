import type { Stats, Configuration as CompilerConfiguration } from "webpack";
import type { Configuration as ServerConfiguration } from "webpack-dev-server";

import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import readline from "readline";
import portFinder from "portfinder";

import { getProcessForPort, isPortAvailable } from "./utils";

export interface DevConfiguration {
    compiler: CompilerConfiguration;
    server: ServerConfiguration;
}

interface CommandConfiguration {
    port: number;
    autoPort: boolean;
}

const promptUser = (port: number): Promise<boolean> =>
    new Promise((resolve, reject) => {
        try {
            const prompt = readline.createInterface(
                process.stdin,
                process.stdout,
            );

            prompt.question(
                `Would you like to use another port instead? (y/n) `,
                async (answer: string) => {
                    resolve(["y", "yes"].includes(answer.toLowerCase()));
                },
            );
        } catch (error) {
            reject(error);
        }
    });

export const prepareConfiguration = async (
    configuration: CommandConfiguration,
): Promise<DevConfiguration> => {
    const { port } = configuration;

    let availablePort = port;
    if (!(await isPortAvailable(port))) {
        const processForPort = getProcessForPort(port);
        console.log(
            `A process is already listening on port ${port}.\n${processForPort}`,
        );

        const find =
            configuration.autoPort || (await promptUser(configuration.port));
        if (!find) {
            console.log(
                "Cannot proceed further without a listenable port. Terminating.",
            );
            process.exit(0);
        }

        availablePort = await portFinder.getPortPromise({
            port: configuration.port,
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

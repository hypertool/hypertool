import type { Stats, Configuration as CompilerConfiguration } from "webpack";
import type { Configuration as ServerConfiguration } from "webpack-dev-server";

import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

export interface DevConfiguration {
    compiler: CompilerConfiguration;
    server: ServerConfiguration;
}

interface CommandConfiguration {
    port: number;
}

export const prepareConfiguration = (
    configuration: CommandConfiguration,
): DevConfiguration => {
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
            port: configuration.port,
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

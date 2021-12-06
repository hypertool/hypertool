import type { Stats, Configuration } from "webpack";
import type { Configuration as ServerConfiguration } from "webpack-dev-server";

import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

const configuration: Configuration = {
    mode: "development",
    entry: "./source/index.js",
};

const devServer: ServerConfiguration = {
    static: {
        directory: path.join(process.cwd(), "dist"),
    },
    compress: true,
    port: 8080,
};

export const startServer = async (): Promise<void> => {
    const compiler = webpack(configuration);
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

    const devServerOptions = { ...devServer, open: true };
    const server = new WebpackDevServer(devServerOptions, compiler);

    console.log("Starting server...");
    await server.start();
};

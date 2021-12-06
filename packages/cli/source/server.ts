import type { Stats, Configuration } from "webpack";

import webpack from "webpack";

const configuration: Configuration = {
    mode: "development",
    entry: "./source/index.js",
};

export const startServer = (): void => {
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
};

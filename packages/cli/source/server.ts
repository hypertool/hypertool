import portFinder from "portfinder";
import prompts from "prompts";
import type { Compiler } from "webpack";
import type { Configuration } from "webpack-dev-server";
import WebpackDevServer from "webpack-dev-server";

import { getProcessForPort, isPortAvailable, isRoot, paths } from "./utils";

const prepare = async (
    port: number,
    autoPort: boolean,
): Promise<Configuration> => {
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
            autoPort ||
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
        static: {
            directory: paths.PUBLIC_DIRECTORY,
            watch: true,
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        historyApiFallback: {
            /* Paths with dots should still use the history fallback.
             * See https://github.com/facebook/create-react-app/issues/387.
             */
            disableDotRule: true,
            index: paths.PUBLIC_URL_OR_PATH,
        },
        compress: true,
        port: availablePort,
        open: true,
    };
};

export const createServer = async (
    port: number,
    autoPort: boolean,
    compiler: Compiler,
): Promise<WebpackDevServer> => {
    const configuration = await prepare(port, autoPort);
    const server = new WebpackDevServer(configuration, compiler);
    return server;
};

import chalk from "chalk";
import { Command } from "commander";
import TaskList from "listr";
import { session } from "@hypertool/common";

import { createServer } from "./server";
import { createCompiler } from "./compiler";
import { createProject } from "./project";
import * as authUtils from "./auth";
import * as manifest from "./manifest";
import { env, logger, listFiles, fsHelper } from "./utils";

import packageData from "../package.json";

const auth = async (): Promise<void> => {
    authUtils.authenticate();
};

const deploy = async (): Promise<void> => {
    const startTime = new Date().getTime();
    const tasks = new TaskList([
        {
            title: "Check authentication status",
            task: async (context, task) => {
                task.title = "Checking authentication status...";

                const deploySession = await authUtils.loadSession();
                const client = session.createPrivateClient(deploySession);

                /* Forward reference to the session and client objects to other
                 * tasks.
                 */
                context.session = deploySession;
                context.client = client;

                task.title = `Authenticated as ${deploySession.user.firstName} ${deploySession.user.lastName} <${deploySession.user.emailAddress}>`;
            },
        },
        {
            title: "Compile manifests",
            task: async (context, task) => {
                task.title = "Compiling manifests...";
                const result = await manifest.compile();
                task.title = `Compiled manifests (queries=${result.queries.length}, resources=${result.resources.length})`;
                context.manifest = result;
            },
        },
        {
            title: "Compile client",
            task: async (context, task) => {
                task.title = "Compiling client...";
                /* The `babel-preset-react-app` preset requires `process.env.NODE_ENV`
                 * to be one of "production", "development", and "test". For the `start`
                 * command, the corresponding value is "development". Similarly, for
                 * the `deploy` command, the corresponding value is "production".
                 * Therefore, we hard code the value where the command is handled.
                 */
                process.env.NODE_ENV = "production";
                const compiler = createCompiler("production");
                compiler.run((error, stats) => {
                    compiler.close((error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                });
                task.title = `Compiled client`;
            },
        },
        {
            title: "Post manifests to Hypertool API",
            task: async (context, task) => {
                task.title = "Posting manifests to Hypertool API...";

                context.client.syncManifest(context.manifest);
                task.title = "Posted manifests to Hypertool API";
            },
        },
        {
            title: "Upload client bundle",
            task: async (context, task) => {
                task.title = "List files...";
                /* The "./build/" prefix must be removed before generating the
                 * signed URLs.
                 *
                 * For some reason Google Cloud Storage produces an error if the
                 * object names begin with "./".
                 */
                const fileNames = await listFiles("./build/**/*");
                const virtualFileNames = fileNames.map((file) =>
                    file.replace("./build/", ""),
                );

                task.title = "Generating signed URL to upload...";
                const signedURLs = await context.client.generateSignedURLs(
                    virtualFileNames,
                );

                task.title = "Uploading files...";
                await fsHelper.uploadFiles(fileNames, signedURLs);

                task.title = "Uploaded client bundle";
            },
        },
    ]);

    const endTime = new Date().getTime();

    try {
        await tasks.run();
        console.log();
        logger.info("Run `hypertool status` to check the deployment status.");
        logger.info(`Done in ${((endTime - startTime) / 1000).toFixed(2)}s`);
    } catch (error) {
        console.log(error);
    }
};

const create = async (configuration: any): Promise<void> => {
    await createProject(configuration.name, configuration.template);
};

const eject = async (): Promise<void> => {
    console.log("You just called the eject command");
};

const start = async (configuration: any): Promise<void> => {
    /* Initialize the environment variables in a controlled fashion. */
    process.env.BABEL_ENV = "development";
    process.env.NODE_ENV = "development";
    env.loadEnv();

    const compiler = createCompiler("development");
    const server = await createServer(
        configuration.port,
        configuration.autoPort,
        compiler,
    );

    console.log("Starting server...");
    await server.start();
};

const configureCommands = (): Command => {
    const program = new Command();
    program.version(packageData.version);

    const authCommand = new Command();
    authCommand
        .name("auth")
        .alias("a")
        .description("authenticates the current machine")
        .action(auth);
    program.addCommand(authCommand);

    const deployCommand = new Command();
    deployCommand
        .name("deploy")
        .alias("d")
        .description("deploys the app")
        .action(deploy);
    program.addCommand(deployCommand);

    const createCommand = new Command();
    createCommand
        .name("create")
        .alias("c")
        .description("creates a new app")
        .argument("<name>", "name of the new app")
        .option("-t, --template <name>", "the template to use", "javascript")
        .action((name) => {
            const configuration = {
                ...program.opts(),
                ...createCommand.opts(),
                name,
            };
            create(configuration);
        });
    program.addCommand(createCommand);

    const startCommand = new Command();
    startCommand
        .name("start")
        .alias("s")
        .description("starts the development server")
        .option(
            "-p, --port <number>",
            "specify the development server port",
            "3000",
        )
        .option(
            "-a, --auto-port",
            "uses the next available port without prompting",
            false,
        )
        .action(() => {
            const configuration = {
                ...program.opts(),
                ...startCommand.opts(),
            };
            start(configuration);
        });
    program.addCommand(startCommand);

    const ejectCommand = new Command();
    ejectCommand
        .name("eject")
        .alias("e")
        .description("ejects the app")
        .action(eject);
    program.addCommand(ejectCommand);

    return program;
};

const main = (): void => {
    console.log(
        chalk.bold(
            `hypertool v${packageData.version} ${chalk.greenBright(
                "(https://hypertool.io)",
            )}\n`,
        ),
    );
    const program = configureCommands();
    program.parse(process.argv);
};

export { main };

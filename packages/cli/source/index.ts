import chalk from "chalk";
import { Command } from "commander";
import TaskList from "listr";

import { createServer } from "./server";
import { createCompiler } from "./compiler";
import * as authUtils from "./auth";
import * as manifest from "./manifest";
import { env } from "./utils";

import packageData from "../package.json";

const auth = async (): Promise<void> => {
    authUtils.authenticate();
};

const deploy = async (): Promise<void> => {
    const tasks = new TaskList([
        {
            title: "Check authentication status",
            task: async (context, task) => {
                task.title = "Checking authentication status...";
                const session = await authUtils.loadSession();
                task.title = `Authenticated as ${session.user.firstName} ${session.user.lastName} <${session.user.emailAddress}>`;
                context.session = session;
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
            title: "Post manifests to Hypertool API",
            task: async (context, task) => {
                task.title = "Posting manifests to Hypertool API...";
                const client = authUtils.createPrivateClient(context.session);
                client.syncManifest(context.manifest);
                task.title =
                    "Posted manifests to Hypertool API\n   Run `hypertool status` to check the deployment status.";
            },
        },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tasks.run().catch((_error) => null);
};

const create = async (): Promise<void> => {
    console.log("You just called the create command");
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
        .action(create);
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

main();

export { main };

import chalk from "chalk";
import { Command } from "commander";

import { createServer } from "./server";
import { createCompiler } from "./compiler";
import * as manifest from "./manifest";

import packageData from "../package.json";

const build = async (): Promise<void> => {
    manifest.compile();
};

const create = async (): Promise<void> => {
    console.log("You just called the create command");
};

const eject = async (): Promise<void> => {
    console.log("You just called the eject command");
};

const start = async (configuration: any): Promise<void> => {
    const compiler = createCompiler(false);
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

    const buildCommand = new Command();
    buildCommand
        .name("build")
        .alias("b")
        .description("builds the app")
        .action(build);
    program.addCommand(buildCommand);

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
            )}`,
        ),
    );
    const program = configureCommands();
    program.parse(process.argv);
};

main();

export { main };

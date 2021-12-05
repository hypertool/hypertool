import chalk from "chalk";
import { Command } from "commander";

const packageData = require("../package");

const build = async (): Promise<void> => {};

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

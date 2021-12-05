import chalk from "chalk";
import { Command } from "commander";

const packageData = require("../package");

const configureCommands = (): Command => {
    const program = new Command();
    program.version(packageData.version);

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

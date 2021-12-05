import chalk from "chalk";

const packageData = require("../package");

const main = (): void => {
    console.log(
        chalk.bold(
            `hypertool v${packageData.version} ${chalk.greenBright(
                "(https://hypertool.io)",
            )}`,
        ),
    );
};

main();

export { main };

import chalk from "chalk";

export const error = (message: string) => {
    console.log(`${chalk.red("[error]")} ${message}`);
};

export const info = (message: string) => {
    console.log(`${chalk.green("[info]")} ${message}`);
};

export const warning = (message: string) => {
    console.log(`${chalk.yellow("[warning]")} ${message}`);
};

export const compileError = (duplicate: string, filePath: string) => {
    console.log(
        `${chalk.red(
            "[error]",
        )} ${filePath}: Duplicate symbol "${duplicate}" found.`,
    );
};

export const semanticError = (message: string, filePath: string) => {
    console.log(`${chalk.red("[error]")} ${filePath}: ${message}`);
};

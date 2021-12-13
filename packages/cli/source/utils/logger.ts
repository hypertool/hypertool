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

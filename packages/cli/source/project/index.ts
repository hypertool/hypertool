import simpleGit, { SimpleGit } from "simple-git";
import * as path from "path";
import * as fsExtra from "fs-extra";
import TaskList from "listr";
import chalk from "chalk";
import { chdir } from "process";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const repositoryByTemplate = {
    starter: "https://github.com/hypertool/hypertool-starter",
};

export const createProject = async (
    name: string,
    template: string,
): Promise<void> => {
    const repository = (repositoryByTemplate as any)[template] || template;
    const localRepository = path.join(process.cwd(), name);
    const localDotGit = path.join(localRepository, ".git");

    const tasks = new TaskList([
        {
            title: `Download template "${template}"`,
            task: async (context, task) => {
                const git: SimpleGit = simpleGit({
                    baseDir: process.cwd(),
                    binary: "git",
                    maxConcurrentProcesses: 1,
                });

                task.title = `Cloning repository ${chalk.bold(repository)}`;
                await git.clone(repository, localRepository);

                task.title = `Deleting old local repository ${chalk.bold(
                    localDotGit,
                )}`;
                await fsExtra.rm(localDotGit, { recursive: true, force: true });

                task.title = `Downloaded template ${chalk.bold(template)}`;
            },
        },
        {
            title: `Initialize repository`,
            task: async (context, task) => {
                const git: SimpleGit = simpleGit({
                    baseDir: localRepository,
                    binary: "git",
                    maxConcurrentProcesses: 1,
                });

                task.title = `Initializing new local repository ${chalk.bold(
                    localDotGit,
                )}`;
                await git.init();

                task.title = `Creating initial commit...`;
                await git.add(".");
                await git.commit("Initial commit created by Hypertool CLI");

                task.title = `Repository initialized at ${chalk.bold(
                    localRepository,
                )}`;
            },
        },
        {
            title: `Installing dependencies`,
            task: async (context, task) => {
                try {
                    chdir(name);
                    const { stdout, stderr } = await exec(`yarn install`);
                } catch (error) {
                    console.error(`error: {error.message}`);
                }
            },
        },
        {
            title: `Finalize project`,
            task: async (context, task) => {
                task.title = `Successfully created project ${chalk.bold(name)}`;
            },
        },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tasks.run().catch((_error) => null);
};

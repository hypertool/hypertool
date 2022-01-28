import type { Session } from "@hypertool/common";

import { PublicClient } from "@hypertool/common";
import chalk from "chalk";
import fs from "fs-extra";
import os from "os";
import path from "path";

import { startServer } from "./server";
import { logger } from "../utils";
import { compile } from "../manifest";

const HOME_DIRECTORY = os.homedir();
const SESSION_DESCRIPTOR = path.join(
    HOME_DIRECTORY,
    ".hypertool",
    "session.json",
);

const authenticate = async (): Promise<void> => {
    const { app } = await compile();
    const publicClient = new PublicClient(app.name);
    const authorizationToken = await startServer();
    const authSession = await publicClient.loginWithGoogle(
        authorizationToken,
        "cli",
    );

    logger.info(`Hi, ${authSession.user.firstName}!`);
    logger.info(
        `You have authenticated as ${chalk.blue.bold(
            authSession.user.emailAddress,
        )}.`,
    );
    await fs.outputFile(
        SESSION_DESCRIPTOR,
        JSON.stringify(authSession, null, 4),
    );
};

const loadSession = async (): Promise<Session> => {
    try {
        return await fs.readJSON(SESSION_DESCRIPTOR);
    } catch (error) {
        throw new Error(
            "You are not authenticated. Run `hypertool auth` before continuing.",
        );
    }
};

export { authenticate, loadSession };

import type { Manifest, Query, IResource } from "@hypertool/common";

import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import joi, { string } from "joi";
import chalk from "chalk";
import { constants } from "@hypertool/common";
import lodash from "lodash";

import { paths } from "../utils";

let errorCount = 0;

/**
 * Joi Validation Schema for App, Query, Resource and Manifest
 */
const appSchema = joi.object({
    name: joi.string().max(128).regex(constants.namePattern).required(),
    title: joi.string().max(256).required(),
    slug: joi.string().max(128).regex(constants.namePattern).required(),
    description: joi.string().max(512).allow("").default(""),
    groups: joi
        .array()
        .items(joi.string().regex(constants.namePattern))
        .default(["default"]),
});

const querySchema = joi.object({
    name: joi.string().max(128).regex(constants.namePattern).required(),
    description: joi.string().max(1024).allow("").default(""),
    resource: joi.string().regex(constants.namePattern).required(),
    content: joi.string().max(10240).required(),
});

const resourceSchema = joi.object({
    name: joi.string().max(256).regex(constants.namePattern).required(),
    description: joi.string().max(512).allow("").default(""),
    type: joi
        .string()
        .valid(...constants.resourceTypes)
        .required(),
    connection: joi.alternatives(joi.string(), joi.object()).required(),
});

const manifestSchema = joi.object({
    app: appSchema,
    queries: joi.array().items(querySchema),
    resources: joi.array().items(resourceSchema),
    file: joi.string(),
    values: joi.alternatives(joi.string(), joi.object().unknown(true)),
});

/**
 * Logs a duplicate error. Compiler specific function, hence not in the file with
 * other error logging functions.
 */
export const logDuplicateError = (
    duplicate: string,
    filePath = "<anonymous>",
) => {
    errorCount++;
    console.log(
        `${chalk.red(
            "[error]",
        )} ${filePath}: Duplicate symbol "${duplicate}" found.\n`,
    );
};

/**
 * Logs a semantic error. Compiler specific function, hence not in the file with
 * other error logging functions.
 */
export const logSemanticError = (message: string, filePath = "<anonymous>") => {
    errorCount++;
    console.log(`${chalk.red("[error]")} ${filePath}: ${message}\n`);
};

/**
 * Logs multiple errors. Compiler specific function, hence not in the file with
 * other error logging functions.
 */
export const logAllErrors = (details: any, filePath = "<anonymous>") => {
    details.map((error: any) => {
        errorCount++;
        console.log(`${chalk.red("[error]")} ${filePath}: ${error.message}\n`);
    });
};

const validateQueries = (
    queries: any,
    externalQueries: any,
    path = "<anonymous>",
) => {
    const result: any = {};
    for (const query of queries) {
        if (result[query.name] || externalQueries[query.name]) {
            logDuplicateError(query.name, path);
        }
        result[query.name] = query;
    }
    return result;
};

const validateResources = (
    resources: any,
    externalResources: any,
    path = "<anonymous>",
) => {
    const result: any = {};
    for (const resource of resources) {
        if (result[resource.name] || externalResources[resource.name]) {
            logDuplicateError(resource.name, path);
        }
        result[resource.name] = resource;
    }
    return result;
};

const compile = async (): Promise<Manifest> => {
    const files = await paths.globAsync(
        paths.MANIFEST_DIRECTORY + "/**/*.{yml,yaml}",
    );

    const promises: Promise<string>[] = files.map((file) =>
        fs.promises.readFile(file, "utf-8"),
    );
    const result: string[] = await Promise.all(promises);
    const currentDirectory = process.cwd();
    const manifests: Manifest[] = result.map((item, index) => {
        const manifest: Manifest = yaml.load(item) as Manifest;
        manifest.file = path.relative(currentDirectory, files[index]);
        return manifest;
    });

    const manifestResult: {
        app: object;
        queries: object;
        resources: object;
        values: object;
        file: string;
    } = {
        app: {},
        queries: {},
        resources: {},
        values: {},
        file: "",
    };

    const queries: Query[] = [];
    const resources: IResource[] = [];

    for (const manifest of manifests) {
        for (const key in manifest) {
            switch (key) {
                case "app": {
                    if (!lodash.isEmpty(manifestResult.app)) {
                        logDuplicateError("app", manifest.file);
                    }
                    manifestResult.app = manifest.app;
                    break;
                }

                case "queries": {
                    lodash.merge(
                        queries,
                        validateQueries(
                            manifest.queries,
                            queries,
                            manifest.file,
                        ),
                    );
                    break;
                }

                case "resources": {
                    lodash.merge(
                        resources,
                        validateResources(
                            manifest.resources,
                            resources,
                            manifest.file,
                        ),
                    );
                    break;
                }

                case "values": {
                    manifestResult.values = <object>manifest.values;
                    break;
                }
            }
        }
    }

    manifestResult.queries = Object.entries(queries).map((item) => item[1]);
    manifestResult.resources = Object.entries(resources).map((item) => item[1]);

    const { error, value } = manifestSchema.validate(manifestResult, {
        stripUnknown: true,
        abortEarly: false,
    });

    if (error) {
        logAllErrors(error.details);
    }

    return <Manifest>value;
};

export default compile;

import type { Manifest, Query, Resource } from "@hypertool/common";

import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import joi from "joi";
import chalk from "chalk";
import { constants } from "@hypertool/common";
import lodash from "lodash";

import { paths } from "../utils";

let errorCount = 0;

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z_0-9-]+[a-zA-Z_0-9]$/;

/**
 * Joi Validation Schema for App, Query, Resource and Manifest
 */
const appSchema = joi.object({
    name: joi.string().max(128).regex(IDENTIFIER_REGEX).required(),
    title: joi.string().max(256).regex(IDENTIFIER_REGEX).required(),
    slug: joi.string().max(128).regex(IDENTIFIER_REGEX).required(),
    description: joi.string().max(512).allow("").default(""),
    groups: joi
        .array()
        .items(joi.string().regex(IDENTIFIER_REGEX))
        .default(["default"]),
});

const querySchema = joi.object({
    name: joi.string().max(128).regex(IDENTIFIER_REGEX).required(),
    description: joi.string().max(1024).allow("").default(""),
    resource: joi.string().regex(IDENTIFIER_REGEX).required(),
    content: joi.string().max(10240).required(),
});

const resourceSchema = joi.object({
    name: joi.string().max(256).regex(IDENTIFIER_REGEX).required(),
    description: joi.string().max(512).allow("").default(""),
    type: joi
        .string()
        .valid(...constants.resourceTypes)
        .required(),
    connection: joi.any().required(),
});

const manifestSchema = joi.object({
    app: joi.object(appSchema),
    queries: joi.array().items(querySchema),
    resources: joi.array().items(resourceSchema),
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

const validateQueries = (queries: any, path = "<anonymous>") => {
    const result: any = {};
    for (const query of queries) {
        if (result[query.name]) {
            logDuplicateError(query.name, path);
        }
        const { error, value } = querySchema.validate(query, {
            stripUnknown: true,
        });
        if (error) {
            logSemanticError(error.message);
        }
        result[query.name] = value;
    }
    return result;
};

const validateResources = (resources: any, path = "<anonymous>") => {
    const result: any = {};
    for (const resource of resources) {
        if (result[resource.name]) {
            logDuplicateError(resource.name, path);
        }
        const { error, value } = resourceSchema.validate(resource, {
            stripUnknown: true,
        });
        if (error) {
            logSemanticError(error.message);
        }
        result[resource.name] = value;
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

    let manifestResult = {
        app: {},
        queries: {},
        resources: {},
    };

    let queries: Query[] = [];
    let resources: Resource[] = [];

    for (const manifest of manifests) {
        for (const key in manifest) {
            switch (key) {
                case "app": {
                    if (!lodash.isEmpty(manifestResult.app)) {
                        logDuplicateError("app", manifest.file);
                    }

                    const { error, value } = appSchema.validate(manifest.app, {
                        stripUnknown: true,
                    });

                    if (error) {
                        logSemanticError(error.message);
                        break;
                    }
                    manifestResult.app = value;
                    break;
                }

                case "queries": {
                    lodash.merge(
                        queries,
                        validateQueries(manifest.queries, manifest.file),
                    );
                    break;
                }

                case "resources": {
                    lodash.merge(
                        resources,
                        validateResources(manifest.resources, manifest.file),
                    );
                    break;
                }
            }
        }
    }

    manifestResult.queries = Object.entries(queries).map((item) => item[1]);
    manifestResult.resources = Object.entries(resources).map((item) => item[1]);

    const { error, value } = manifestSchema.validate(manifestResult, {
        stripUnknown: true,
    });

    if (error) {
        logSemanticError(error.message);
    }

    return <Manifest>value;
};

export default compile;

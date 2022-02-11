import type { Manifest, App, Query, Resource } from "@hypertool/common";

import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import joi from "joi";
import chalk from "chalk";
import { constants } from "@hypertool/common";

import { paths } from "../utils";

let errorCount = 0;

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z_0-9-]+[a-zA-Z_0-9]$/;

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
    description: joi.string().max(1024).allow(""),
    resource: joi.string().regex(IDENTIFIER_REGEX).required(),
    content: joi.string().max(10240).required(),
});

const resourceSchema = joi.object({
    name: joi.string().max(256).required(),
    description: joi.string().max(512).allow("").default(""),
    type: joi
        .string()
        .valid(...constants.resourceTypes)
        .required(),
    connection: joi.string().required(),
});

const manifestSchema = joi.object({
    app: joi.object(appSchema),
    queries: joi.array().items(querySchema),
    resources: joi.array().items(resourceSchema),
});

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

const parseQueries = (queries: any, path = "<anonymous>") => {
    const result: any = {};
    for (const query of queries) {
        if (result[query.name]) {
            logDuplicateError(query.name, path);
        }
        // result[query.name] = parseQuery(query, path);
    }
    return result;
};

const parseResources = (resources: any, path = "<anonymous>") => {
    const result: any = {};
    for (const resource of resources) {
        if (result[resource.name]) {
            logDuplicateError(resource.name, path);
        }
        // result[resource.name] = parseResource(resource, path);
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

    let app: App | null = null;
    let queries: {
        [key: string]: Query;
    } = {};
    let resources: {
        [key: string]: Resource;
    } = {};
    for (const manifest of manifests) {
        for (const key in manifest) {
            switch (key) {
                case "app": {
                    // app = parseApp(manifest.app, manifest.file);
                    break;
                }

                case "queries": {
                    queries = {
                        ...queries,
                        ...parseQueries(manifest.queries, manifest.file),
                    };
                    break;
                }

                case "resources": {
                    resources = {
                        ...resources,
                        ...parseResources(manifest.resources, manifest.file),
                    };
                    break;
                }
            }
        }
    }

    const queryList: Query[] = Object.entries(queries).map((item) => item[1]);
    const resourceList: Resource[] = Object.entries(resources).map(
        (item) => item[1],
    );

    return { app: app, queries: queryList, resources: resourceList };
};

export default compile;

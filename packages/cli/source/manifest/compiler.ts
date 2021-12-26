/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { paths, getMissingKeys, constants } from "../utils";
import type { Manifest, App, Query, Resource } from "../types";

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z_0-9-]+[a-zA-Z_0-9]$/;

let errorCount = 0;

export const logMissingKeys = (
    regsitryType: string,
    keys: string[],
    filePath = "<anonymous>",
) => {
    errorCount++;
    console.log(
        `${chalk.red(
            "[error]",
        )} ${filePath}: The following keys are missing in ${regsitryType}: ${keys.join(
            ", ",
        )}\n`,
    );
};

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

export const logSemanticError = (message: string, filePath = "<anonymous>") => {
    errorCount++;
    console.log(`${chalk.red("[error]")} ${filePath}: ${message}\n`);
};

const parseApp = (app: App, path = "<anonymous>"): App => {
    const result: App = {
        name: "",
        slug: "",
        title: "",
        description: "",
        groups: [],
    };

    const missingKeys = getMissingKeys(constants.appKeys, app);

    if (missingKeys) {
        logMissingKeys("app", missingKeys, path);
    }

    for (const key in app) {
        const value = (app as any)[key];
        switch (key) {
            case "name": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError(`App name "${value}" is invalid.`, path);
                }
                result.name = value.trim();
                break;
            }

            case "slug": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError(`App slug "${value}" is invalid.`, path);
                }
                result.slug = value.trim();
                break;
            }

            case "title": {
                const trimmed = value.trim();

                if (trimmed.indexOf("\n") > 0) {
                    logSemanticError("App title cannot contain newlines", path);
                }

                if (trimmed.length === 0) {
                    logSemanticError("App title cannot be empty", path);
                }

                result.title = trimmed;
                break;
            }

            case "description": {
                result.description = value.trim();
                break;
            }

            case "groups": {
                result.groups = value;
                break;
            }
        }
    }
    return result;
};

const parseQuery = (query: Query, path = "<anonymous>"): Query => {
    const result: Query = {
        name: "",
        description: "",
        resource: "",
        content: "",
    };

    const missingKeys = getMissingKeys(constants.queryKeys, query);

    if (missingKeys) {
        logMissingKeys("queries", missingKeys, path);
    }

    for (const key in query) {
        const value = (query as any)[key];

        switch (key) {
            case "name": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError("Query name is invalid.", path);
                }
                result.name = value.trim();
                break;
            }

            case "description": {
                result.description = value.trim();
                break;
            }

            case "resource": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError("Query resource is invalid.", path);
                }
                result.resource = value.trim();
                break;
            }

            case "content": {
                result.content =
                    typeof value === "string" ? value.trim() : value;
                break;
            }
        }
    }
    return result;
};

const parseResource = (resource: Resource, path: string): Resource => {
    const result: Resource = {
        name: "",
        type: "",
        connection: "",
    };

    const missingKeys = getMissingKeys(constants.resourceKeys, resource);

    if (missingKeys) {
        logMissingKeys("resources", missingKeys, path);
    }

    for (const key in resource) {
        const value = (resource as any)[key];

        switch (key) {
            case "name": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError("Resource name is invalid.", path);
                }
                result.name = value.trim();
                break;
            }

            case "type": {
                result.type = value.trim();
                break;
            }

            // TODO: Implement parseConnection()
            case "connection": {
                result.connection =
                    typeof value === "string" ? value.trim() : value;
                break;
            }
        }
    }
    return result;
};

const parseQueries = (queries: any, path = "<anonymous>") => {
    const result: any = {};
    for (const query of queries) {
        if (result[query.name]) {
            logDuplicateError(query.name, path);
        }
        result[query.name] = parseQuery(query, path);
    }
    return result;
};

const parseResources = (resources: any, path = "<anonymous>") => {
    const result: any = {};
    for (const resource of resources) {
        if (result[resource.name]) {
            logDuplicateError(resource.name, path);
        }
        result[resource.name] = parseResource(resource, path);
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
                    if (app) {
                        logDuplicateError("app", manifest.file);
                    }
                    app = parseApp(manifest.app, manifest.file);
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

    if (!app) {
        logSemanticError("App manifest is missing", "<global>");
    }

    if (errorCount > 0) {
        throw new Error(
            `The compilation failed with ${errorCount} error${
                errorCount === 1 ? "" : "s"
            }.`,
        );
    }

    return { app: app as App, queries: queryList, resources: resourceList };
};

export default compile;

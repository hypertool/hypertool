/* eslint-disable @typescript-eslint/no-explicit-any */

import yaml from "js-yaml";
import { glob } from "glob";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import { paths } from "../utils";
import type { Manifest, App, Query, Resource } from "../types";

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z_0-9]+[a-zA-Z_0-9]$/;

export const logDuplicateError = (duplicate: string, filePath: string) => {
    console.log(
        `${chalk.red(
            "[error]",
        )} ${filePath}: Duplicate symbol "${duplicate}" found.`,
    );
};

export const logSemanticError = (message: string, filePath: string) => {
    console.log(`${chalk.red("[error]")} ${filePath}: ${message}`);
};

const parseApp = (app: App, path: string) => {
    const result: Record<string, any> = {};
    for (const key in app) {
        if (result[key]) {
            logDuplicateError(key, path);
        }

        const value = (app as any)[key];
        switch (key) {
            case "slug": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError(`App slug ${value} is invalid.`, path);
                }
                result.slug = value;
                break;
            }

            case "title": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError(`App title ${value} is invalid.`, path);
                }
                result.title = value.trim();
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

const parseQuery = (query: Query, path: string) => {
    const result: Query = {
        name: "",
        resource: "",
        content: "",
    };
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

            case "resource": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError("Query resource is invalid.", path);
                }
                result.resource = value.trim();
                break;
            }

            case "content": {
                result.content = value;
                break;
            }
        }
    }
    return result;
};

const parseResource = (resource: Resource, path: string) => {
    const result: Resource = {
        name: "",
        type: "",
        connection: "",
    };
    for (const key in resource) {
        const value = (resource as any)[key];

        switch (key) {
            case "name": {
                if (!IDENTIFIER_REGEX.test(value)) {
                    logSemanticError("Resource name is invalid.", path);
                }
                result.name = value;
                break;
            }

            case "type": {
                result.type = value;
                break;
            }

            case "connection": {
                result.connection = value;
                break;
            }
        }
    }
    return result;
};

const parseQueries = (queries: any, path: string) => {
    const result: any = {};
    for (const query of queries) {
        if (result[query.name]) {
            logDuplicateError(query.name, path);
        }
        result[query.name] = parseQuery(query, path);
    }
    return result;
};

const parseResources = (resources: any, path: string) => {
    const result: any = {};
    for (const resource of resources) {
        if (result[resource.name]) {
            logDuplicateError(resource.name, path);
        }
        result[resource.name] = parseResource(resource, path);
    }
    return result;
};

const compile = () => {
    glob(
        paths.MANIFEST_DIRECTORY + "/**/*.{yml, yaml}",
        async (error: Error | null, files: string[]) => {
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

            let app: any = null,
                queries: any = {},
                resources: any = {};

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
                                ...parseQueries(
                                    manifest.queries,
                                    manifest.file,
                                ),
                            };
                            break;
                        }

                        case "resources": {
                            resources = {
                                ...resources,
                                ...parseResources(
                                    manifest.resources,
                                    manifest.file,
                                ),
                            };
                            break;
                        }
                    }
                }
            }

            queries = Object.entries(queries).map((item) => item[1]);
            resources = Object.entries(resources).map((item) => item[1]);

            // Send the parsed objects to the Query Engine Service
        },
    );
};

export default compile;

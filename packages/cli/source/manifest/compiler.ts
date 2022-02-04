/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import yaml from "js-yaml";
import fs from "fs";
import path from "path";

import { paths, getMissingKeys, constants } from "../utils";
import type { Manifest, App, Query, Resource } from "../types";

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z_0-9-]+[a-zA-Z_0-9]$/;

const parseApp = (app: App, path = "<anonymous>"): App => {
    const result: App = {
        name: "",
        slug: "",
        title: "",
        description: "",
        groups: ["default"],
    };

    const missingKeys = getMissingKeys(constants.appKeys, app);

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
                result.groups = value.length === 0 ? ["default"] : value;
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

    for (const key in query) {
        const value = (query as any)[key];

        switch (key) {
            case "name": {
                result.name = value.trim();
                break;
            }

            case "description": {
                result.description = value.trim();
                break;
            }

            case "resource": {
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
        description: "",
        type: "",
        connection: "",
    };

    const missingKeys = getMissingKeys(constants.resourceKeys, resource);

    for (const key in resource) {
        const value = (resource as any)[key];

        switch (key) {
            case "name": {
                result.name = value.trim();
                break;
            }

            case "description": {
                result.description = value.trim();
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
        result[query.name] = parseQuery(query, path);
    }
    return result;
};

const parseResources = (resources: any, path = "<anonymous>") => {
    const result: any = {};
    for (const resource of resources) {
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

    return { app: app as App, queries: queryList, resources: resourceList };
};

export default compile;

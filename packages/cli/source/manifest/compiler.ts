/* eslint-disable @typescript-eslint/no-explicit-any */
import yaml from "js-yaml";
import { glob } from "glob";
import fs from "fs";
import path from "path/posix";

import { logger, paths } from "../utils";
import { Manifest, Query, Resource } from "../types";

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z_0-9]+[a-zA-Z_0-9]$/;

const appParser = (manifest: Manifest) => {
    const appObject: Record<string, any> = {};
    for (const property in manifest.app) {
        if (appObject[property]) {
            logger.compileError(property, manifest.file);
        }

        const value = (manifest.app as any)[property];
        switch (property) {
            case "slug":
                if (!IDENTIFIER_REGEX.test(value)) {
                    logger.semanticError(
                        `App slug ${value} is invalid.`,
                        manifest.file,
                    );
                }
                appObject.slug = value;
                break;
            case "title":
                if (!IDENTIFIER_REGEX.test(value)) {
                    logger.semanticError(
                        `App title ${value} is invalid.`,
                        manifest.file,
                    );
                }
                appObject.title = value.trim();
                break;
            case "description":
                appObject.description = value.trim();
                break;
            case "groups":
                appObject.groups = value;
                break;
        }
    }
    return appObject;
};

const queryParser = (query: Query, path: string) => {
    const queryObject: Query = {
        name: "",
        resource: "",
        content: "",
    };
    for (const property in query) {
        const value = (query as any)[property];

        switch (property) {
            case "name":
                if (!IDENTIFIER_REGEX.test(value)) {
                    logger.semanticError("Query name is invalid.", path);
                }
                queryObject.name = value.trim();
                break;
            case "resource":
                if (!IDENTIFIER_REGEX.test(value)) {
                    logger.semanticError("Query resource is invalid.", path);
                }
                queryObject.resource = value.trim();
                break;
            case "content":
                queryObject.content = value;
                break;
        }
    }
    return queryObject;
};

const resourceParser = (resource: Resource, path: string) => {
    const resourceObject: Resource = {
        name: "",
        type: "",
        connection: "",
    };
    for (const property in resource) {
        const value = (resource as any)[property];

        switch (property) {
            case "name":
                if (!IDENTIFIER_REGEX.test(value)) {
                    logger.semanticError("Resource name is invalid.", path);
                }
                resourceObject.name = value;
                break;
            case "type":
                resourceObject.type = value;
                break;
            case "connection":
                resourceObject.connection = value;
                break;
        }
    }
    return resourceObject;
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
                        case "app":
                            if (app) {
                                logger.compileError("app", manifest.file);
                            }

                            app = appParser(manifest);
                            break;
                        case "queries":
                            for (const query of manifest[key]) {
                                if (queries[query.name]) {
                                    logger.compileError(
                                        query.name,
                                        manifest.file,
                                    );
                                }

                                queries[query.name] = queryParser(
                                    query,
                                    manifest.file,
                                );
                            }
                            break;
                        case "resources":
                            for (const resource of manifest[key]) {
                                if (resources[resource.name]) {
                                    logger.compileError(
                                        resource.name,
                                        manifest.file,
                                    );
                                }

                                resources[resource.name] = resourceParser(
                                    resource,
                                    manifest.file,
                                );
                            }
                            break;
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

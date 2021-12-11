/* eslint-disable @typescript-eslint/no-explicit-any */
import yaml from "js-yaml";
import { glob } from "glob";
import fs from "fs";

<<<<<<< HEAD
import { paths } from "../utils";
=======
import * as paths from "../config/paths";
import { logger } from "../utils";
import { Manifest } from "../types";
>>>>>>> 816e8b2... feat: created the `YAML` parser for `app`, `resources` and `queries`

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z_0-9]+[a-zA-Z_0-9]$/;

const compile = () => {
    glob(
        paths.MANIFEST_DIRECTORY + "/**/*.{yml, yaml}",
        async (error: Error | null, files: string[]) => {
            const promises: Promise<string>[] = files.map((file) =>
                fs.promises.readFile(file, "utf-8"),
            );
            const result: string[] = await Promise.all(promises);
            const manifests: Manifest[] = result.map((item, index) => {
                const manifest: Manifest = yaml.load(item) as Manifest;
                manifest.file = files[index];
                return manifest;
            });

            let app = null;

            const queries: Record<string, any> = {},
                resources: Record<string, any> = {};

            for (const manifest of manifests) {
                for (const key in manifest) {
                    switch (key) {
                        case "app":
                            if (app) {
                                logger.compileError("app", manifest.file);
                            } else {
                                for (const property in manifest[key]) {
                                    /* We first check if the app object is non
                                     * empty, in which case it implies a compile
                                     * error.
                                     */
                                    if (app !== null && app[property]) {
                                        logger.compileError(
                                            property,
                                            manifest.file,
                                        );
                                    } else if (app === null) {
                                        app = {};
                                    }

                                    /* Since we have not found any duplicates in
                                     * the app object, we can now proceed to
                                     * check the validity of the values of these
                                     * properties.
                                     */
                                    const value = (manifest as any)[key][
                                        property
                                    ];
                                    switch (property) {
                                        case "slug":
                                            if (!IDENTIFIER_REGEX.test(value)) {
                                                logger.semanticError(
                                                    "App slug is invalid.",
                                                    manifest.file,
                                                );
                                            }
                                            (app as any)[property] = value;
                                            break;
                                        case "title":
                                            (app as any)[property] =
                                                value.trim();
                                            break;
                                        case "description":
                                            (app as any)[property] =
                                                value.trim();
                                            break;
                                        case "groups":
                                            (app as any)[property] = value;
                                            break;
                                    }
                                }
                            }
                            break;
                        case "queries":
                            for (const query of manifest[key]) {
                                if (queries[query.name]) {
                                    logger.compileError(
                                        query.name,
                                        manifest.file,
                                    );
                                }

                                /* Since we have not found any queries with the
                                 * same name as this query, we now validate all
                                 * the properties of this query object.
                                 */
                                const queryObject: Record<string, any> = {};
                                for (const property in query) {
                                    const value = (query as any)[property];

                                    switch (property) {
                                        case "name":
                                            if (!IDENTIFIER_REGEX.test(value)) {
                                                logger.semanticError(
                                                    "Query name is invalid.",
                                                    manifest.file,
                                                );
                                            }
                                            queryObject[property] =
                                                value.trim();
                                            break;
                                        case "resource":
                                            if (!IDENTIFIER_REGEX.test(value)) {
                                                logger.semanticError(
                                                    "Query resource is invalid.",
                                                    manifest.file,
                                                );
                                            }
                                            queryObject[property] =
                                                value.trim();
                                            break;
                                        case "content":
                                            queryObject[property] = value;
                                            break;
                                    }
                                }
                                queries[query.name] = queryObject;
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

                                /* Since we have not found any resources with
                                 * the same name as this resource, we now validate
                                 * all the properties of this query object.
                                 */
                                const resourceObject: Record<string, any> = {};
                                for (const property in resource) {
                                    const value = (resource as any)[property];

                                    switch (property) {
                                        case "name":
                                            if (!IDENTIFIER_REGEX.test(value)) {
                                                logger.semanticError(
                                                    "Resource name is invalid.",
                                                    manifest.file,
                                                );
                                            }
                                            resourceObject[property] = value;
                                            break;
                                        case "type":
                                            resourceObject[property] = value;
                                            break;
                                        case "connection":
                                            resourceObject[property] = value;
                                            break;
                                    }
                                }
                                resources[resource.name] = resourceObject;
                            }
                            break;
                    }
                }
            }
        },
    );
};

export default compile;

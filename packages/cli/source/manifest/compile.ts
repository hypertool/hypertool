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

            const app: Record<string, any> = {},
                queries: Record<string, any> = {},
                resources: Record<string, any> = {};

            for (const manifest of manifests) {
                for (const key in manifest) {
                    if (key === "app") {
                        if (Object.keys(app).length !== 0) {
                            logger.compileError("app", manifest.file);
                        } else {
                            for (const appKey in manifest[key]) {
                                if (app[appKey]) {
                                    logger.compileError(appKey, manifest.file);
                                }
                                app[appKey] = (manifest as any)[key][appKey];
                            }
                        }
                    } else if (key === "queries") {
                        for (const query of manifest[key]) {
                            if (queries[query.name]) {
                                logger.compileError(query.name, manifest.file);
                            }
                            const queryProperties: Record<string, any> = {};
                            for (const property in query) {
                                queryProperties[property] = (query as any)[
                                    property
                                ];
                            }
                            queries[query.name] = queryProperties;
                        }
                    } else if (key === "resources") {
                        for (const resource of manifest[key]) {
                            if (resources[resource.name]) {
                                logger.compileError(
                                    resource.name,
                                    manifest.file,
                                );
                            }
                            const resourceProperties: Record<string, any> = {};
                            for (const property in resource) {
                                resourceProperties[property] = (
                                    resource as any
                                )[property];
                            }
                            resources[resource.name] = resourceProperties;
                        }
                    }
                }
            }
        },
    );
};

export default compile;

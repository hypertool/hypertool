/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * Copyright (c) 2021-present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from "fs";
import path from "path";
import { URL } from "url";

/**
 * Returns a URL or a path with slash at the end.
 * In production can be URL, abolute path, relative path.
 * In development always will be an absolute path.
 * In development can use `path` module functions for operations
 *
 * @param {boolean} development
 * @param {(string|undefined)} homepage a valid url or pathname
 * @param {(string|undefined)} envPublicUrl a valid url or pathname
 * @returns {string}
 */
const getPublicUrlOrPath = (
    development: boolean,
    homepage?: string,
    envPublicUrl?: string,
) => {
    const stubDomain = "https://hypertool.io";

    if (envPublicUrl) {
        // ensure last slash exists
        envPublicUrl = envPublicUrl.endsWith("/")
            ? envPublicUrl
            : envPublicUrl + "/";

        // validate if `envPublicUrl` is a URL or path like
        // `stubDomain` is ignored if `envPublicUrl` contains a domain
        const validPublicUrl = new URL(envPublicUrl, stubDomain);

        return development
            ? envPublicUrl.startsWith(".")
                ? "/"
                : validPublicUrl.pathname
            : // Some apps do not use client-side routing with pushState.
              // For these, "homepage" can be set to "." to enable relative asset paths.
              envPublicUrl;
    }

    if (homepage) {
        // strip last slash if exists
        homepage = homepage.endsWith("/") ? homepage : homepage + "/";

        // validate if `homepage` is a URL or path like and use just pathname
        const validHomepagePathname = new URL(homepage, stubDomain).pathname;
        return development
            ? homepage.startsWith(".")
                ? "/"
                : validHomepagePathname
            : // Some apps do not use client-side routing with pushState.
            // For these, "homepage" can be set to "." to enable relative asset paths.
            homepage.startsWith(".")
            ? homepage
            : validHomepagePathname;
    }

    return "/";
};

export const CWD = process.cwd();

export const APP_DIRECTORY = fs.realpathSync(CWD);

export const CACHE_DIRECTORY = path.join(
    APP_DIRECTORY,
    "node_modules",
    ".cache",
);

export const BUILD_DIRECTORY = path.join(APP_DIRECTORY, "build");

export const PUBLIC_DIRECTORY = path.join(APP_DIRECTORY, "public");

export const NODE_MODULES_DIRECTORY = path.join(APP_DIRECTORY, "node_modules");

export const APP_SOURCE_DIRECTORY = path.join(APP_DIRECTORY, "source");

export const MANIFEST_DIRECTORY = path.join(APP_DIRECTORY, "manifest");

export const SCREENS_DIRECTORY = path.join(APP_DIRECTORY, "screens");

export const APP_ENTRY = path.join(APP_DIRECTORY, "source", "index");

export const APP_HTML = path.join(APP_DIRECTORY, "public", "index.html");

export const PACKAGE_DESCRIPTOR = path.join(APP_DIRECTORY, "package.json");

export const DOT_ENV = path.join(APP_DIRECTORY, ".env");

/* We use `PUBLIC_URL` environment variable or "homepage" field to infer
 * "public path" at which the app is served.
 * Webpack needs to know it to put the right `<script>` hrefs into HTML even in
 * single-page apps that may serve `index.html` for nested URLs like `/todos/42`.
 * We can't use a relative path in HTML because we don't want to load something
 * like /todos/42/static/js/bundle.7289d.js.
 * We have to know the root.
 */
export const PUBLIC_URL_OR_PATH = getPublicUrlOrPath(
    process.env.NODE_ENV === "development",
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(PACKAGE_DESCRIPTOR).homepage,
    process.env.PUBLIC_URL,
);

export const extensions = ["js", "ts", "htx", "json"];

import fs from "fs";
import path from "path";

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

export const APP_ENTRY = path.join(APP_DIRECTORY, "source", "index");

export const APP_HTML = path.join(APP_DIRECTORY, "public", "index.html");

export const PACKAGE_DESCRIPTOR = path.join(APP_DIRECTORY, "package.json");

export const extensions = ["js", "ts", "htx", "json"];

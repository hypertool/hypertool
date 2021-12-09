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

export const APP_ENTRY = path.join(APP_DIRECTORY, "source", "index");

export const extensions = ["js", "jsx", "ts", "tsx", "htx", "json"];

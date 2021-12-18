/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { To, Path } from "history";
import type { ParamParseKey } from "../hooks/useMatch";

import { Children, Fragment, isValidElement } from "react";
import { parsePath } from "history";
import { RouteContext } from "../components";
import Outlet from "../components/Outlet";
import Route from "../components/Route";

export function invariant(condition: any, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

export const warning = (condition: any, message: string): void => {
    if (!condition) {
        // eslint-disable-next-line no-console
        if (typeof console !== "undefined") {
            console.warn(message);
        }

        try {
            /* Welcome to debugging React Router!
             *
             * This error is thrown as a convenience so you can more easily
             * find the source for a warning that appears in the console by
             * enabling "pause on exceptions" in your JavaScript debugger.
             */
            throw new Error(message);
            // eslint-disable-next-line no-empty
        } catch (error) {}
    }
};

const alreadyWarned: Record<string, boolean> = {};

export const warningOnce = (
    key: string,
    condition: boolean,
    message: string,
) => {
    if (!condition && !alreadyWarned[key]) {
        alreadyWarned[key] = true;
        warning(false, message);
    }
};

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/docs/en/v6/api#createroutesfromchildren
 */
export function createRoutesFromChildren(
    children: React.ReactNode,
): RouteObject[] {
    const routes: RouteObject[] = [];

    Children.forEach(children, (element) => {
        if (!isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return;
        }

        if (element.type === Fragment) {
            // Transparently support React.Fragment and its children.
            // eslint-disable-next-line prefer-spread
            routes.push.apply(
                routes,
                createRoutesFromChildren(element.props.children),
            );
            return;
        }

        invariant(
            element.type === Route,
            `[${
                typeof element.type === "string"
                    ? element.type
                    : element.type.name
            }] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`,
        );

        const route: RouteObject = {
            caseSensitive: element.props.caseSensitive,
            element: element.props.element,
            index: element.props.index,
            path: element.props.path,
        };

        if (element.props.children) {
            route.children = createRoutesFromChildren(element.props.children);
        }

        routes.push(route);
    });

    return routes;
}

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export interface RouteObject {
    caseSensitive?: boolean;
    children?: RouteObject[];
    element?: React.ReactNode;
    index?: boolean;
    path?: string;
}

/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/docs/en/v6/api#generatepath
 */
export function generatePath(path: string, params: Params = {}): string {
    return path
        .replace(/:(\w+)/g, (_, key) => {
            invariant(params[key] != null, `Missing ":${key}" param`);
            return params[key]!;
        })
        .replace(/\/*\*$/, (_) =>
            params["*"] == null ? "" : params["*"].replace(/^\/*/, "/"),
        );
}

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<ParamKey extends string = string> {
    /**
     * The names and values of dynamic parameters in the URL.
     */
    params: Params<ParamKey>;
    /**
     * The portion of the URL pathname that was matched.
     */
    pathname: string;
    /**
     * The portion of the URL pathname that was matched before child routes.
     */
    pathnameBase: string;
    /**
     * The route object that was used to match.
     */
    route: RouteObject;
}

/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchroutes
 */
export function matchRoutes(
    routes: RouteObject[],
    locationArg: Partial<Location> | string,
    basename = "/",
): RouteMatch[] | null {
    const location =
        typeof locationArg === "string" ? parsePath(locationArg) : locationArg;

    const pathname = stripBasename(location.pathname || "/", basename);

    if (pathname == null) {
        return null;
    }

    const branches = flattenRoutes(routes);
    rankRouteBranches(branches);

    let matches = null;
    for (let i = 0; matches == null && i < branches.length; ++i) {
        matches = matchRouteBranch(branches[i], pathname);
    }

    return matches;
}

interface RouteMeta {
    relativePath: string;
    caseSensitive: boolean;
    childrenIndex: number;
    route: RouteObject;
}

interface RouteBranch {
    path: string;
    score: number;
    routesMeta: RouteMeta[];
}

function flattenRoutes(
    routes: RouteObject[],
    branches: RouteBranch[] = [],
    parentsMeta: RouteMeta[] = [],
    parentPath = "",
): RouteBranch[] {
    routes.forEach((route, index) => {
        const meta: RouteMeta = {
            relativePath: route.path || "",
            caseSensitive: route.caseSensitive === true,
            childrenIndex: index,
            route,
        };

        if (meta.relativePath.startsWith("/")) {
            invariant(
                meta.relativePath.startsWith(parentPath),
                `Absolute route path "${meta.relativePath}" nested under path ` +
                    `"${parentPath}" is not valid. An absolute child route path ` +
                    `must start with the combined path of all its parent routes.`,
            );

            meta.relativePath = meta.relativePath.slice(parentPath.length);
        }

        const path = joinPaths([parentPath, meta.relativePath]);
        const routesMeta = parentsMeta.concat(meta);

        // Add the children before adding this route to the array so we traverse the
        // route tree depth-first and child routes appear before their parents in
        // the "flattened" version.
        if (route.children && route.children.length > 0) {
            invariant(
                route.index !== true,
                `Index routes must not have child routes. Please remove ` +
                    `all child routes from route path "${path}".`,
            );

            flattenRoutes(route.children, branches, routesMeta, path);
        }

        // Routes without a path shouldn't ever match by themselves unless they are
        // index routes, so don't add them to the list of possible branches.
        if (route.path == null && !route.index) {
            return;
        }

        branches.push({
            path,
            score: computeScore(path, route.index),
            routesMeta,
        });
    });

    return branches;
}

function rankRouteBranches(branches: RouteBranch[]): void {
    branches.sort((a, b) =>
        a.score !== b.score
            ? b.score - a.score // Higher score first
            : compareIndexes(
                  a.routesMeta.map((meta) => meta.childrenIndex),
                  b.routesMeta.map((meta) => meta.childrenIndex),
              ),
    );
}

const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s: string) => s === "*";

function computeScore(path: string, index: boolean | undefined): number {
    const segments = path.split("/");
    let initialScore = segments.length;
    if (segments.some(isSplat)) {
        initialScore += splatPenalty;
    }

    if (index) {
        initialScore += indexRouteValue;
    }

    return segments
        .filter((s) => !isSplat(s))
        .reduce(
            (score, segment) =>
                score +
                (paramRe.test(segment)
                    ? dynamicSegmentValue
                    : segment === ""
                    ? emptySegmentValue
                    : staticSegmentValue),
            initialScore,
        );
}

function compareIndexes(a: number[], b: number[]): number {
    const siblings =
        a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);

    return siblings
        ? // If two routes are siblings, we should try to match the earlier sibling
          // first. This allows people to have fine-grained control over the matching
          // behavior by simply putting routes with identical paths in the order they
          // want them tried.
          a[a.length - 1] - b[b.length - 1]
        : // Otherwise, it doesn't really make sense to rank non-siblings by index,
          // so they sort equally.
          0;
}

function matchRouteBranch<ParamKey extends string = string>(
    branch: RouteBranch,
    pathname: string,
): RouteMatch<ParamKey>[] | null {
    const { routesMeta } = branch;

    const matchedParams = {};
    let matchedPathname = "/";
    const matches: RouteMatch[] = [];
    for (let i = 0; i < routesMeta.length; ++i) {
        const meta = routesMeta[i];
        const end = i === routesMeta.length - 1;
        const remainingPathname =
            matchedPathname === "/"
                ? pathname
                : pathname.slice(matchedPathname.length) || "/";
        const match = matchPath(
            { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
            remainingPathname,
        );

        if (!match) return null;

        Object.assign(matchedParams, match.params);

        const route = meta.route;

        matches.push({
            params: matchedParams,
            pathname: joinPaths([matchedPathname, match.pathname]),
            pathnameBase: joinPaths([matchedPathname, match.pathnameBase]),
            route,
        });

        if (match.pathnameBase !== "/") {
            matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
        }
    }

    return matches;
}

/**
 * Renders the result of `matchRoutes()` into a React element.
 */
export function renderMatches(
    matches: RouteMatch[] | null,
): React.ReactElement | null {
    return _renderMatches(matches);
}

export function _renderMatches(
    matches: RouteMatch[] | null,
    parentMatches: RouteMatch[] = [],
): React.ReactElement | null {
    if (matches == null) return null;

    return matches.reduceRight(
        (outlet, match, index) => (
            <RouteContext.Provider
                value={{
                    outlet,
                    matches: parentMatches.concat(matches.slice(0, index + 1)),
                }}
                children={
                    match.route.element !== undefined ? (
                        match.route.element
                    ) : (
                        <Outlet />
                    )
                }
            />
        ),
        null as React.ReactElement | null,
    );
}

/**
 * A PathPattern is used to match on some portion of a URL pathname.
 */
export interface PathPattern<Path extends string = string> {
    /**
     * A string to match against a URL pathname. May contain `:id`-style segments
     * to indicate placeholders for dynamic parameters. May also end with `/*` to
     * indicate matching the rest of the URL pathname.
     */
    path: Path;
    /**
     * Should be `true` if the static portions of the `path` should be matched in
     * the same case.
     */
    caseSensitive?: boolean;
    /**
     * Should be `true` if this pattern should match the entire URL pathname.
     */
    end?: boolean;
}

/**
 * A PathMatch contains info about how a PathPattern matched on a URL pathname.
 */
export interface PathMatch<ParamKey extends string = string> {
    /**
     * The names and values of dynamic parameters in the URL.
     */
    params: Params<ParamKey>;
    /**
     * The portion of the URL pathname that was matched.
     */
    pathname: string;
    /**
     * The portion of the URL pathname that was matched before child routes.
     */
    pathnameBase: string;
    /**
     * The pattern that was used to match.
     */
    pattern: PathPattern;
}

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/docs/en/v6/api#matchpath
 */
export function matchPath<
    ParamKey extends ParamParseKey<Path>,
    Path extends string,
>(
    pattern: PathPattern<Path> | Path,
    pathname: string,
): PathMatch<ParamKey> | null {
    if (typeof pattern === "string") {
        pattern = { path: pattern, caseSensitive: false, end: true };
    }

    const [matcher, paramNames] = compilePath(
        pattern.path,
        pattern.caseSensitive,
        pattern.end,
    );

    const match = pathname.match(matcher);
    if (!match) return null;

    const matchedPathname = match[0];
    let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
    const captureGroups = match.slice(1);
    const params: Params = paramNames.reduce<Mutable<Params>>(
        (memo, paramName, index) => {
            // We need to compute the pathnameBase here using the raw splat value
            // instead of using params["*"] later because it will be decoded then
            if (paramName === "*") {
                const splatValue = captureGroups[index] || "";
                pathnameBase = matchedPathname
                    .slice(0, matchedPathname.length - splatValue.length)
                    .replace(/(.)\/+$/, "$1");
            }

            memo[paramName] = safelyDecodeURIComponent(
                captureGroups[index] || "",
                paramName,
            );
            return memo;
        },
        {},
    );

    return {
        params,
        pathname: matchedPathname,
        pathnameBase,
        pattern,
    };
}

function compilePath(
    path: string,
    caseSensitive = false,
    end = true,
): [RegExp, string[]] {
    warning(
        path === "*" || !path.endsWith("*") || path.endsWith("/*"),
        `Route path "${path}" will be treated as if it were ` +
            `"${path.replace(/\*$/, "/*")}" because the \`*\` character must ` +
            `always follow a \`/\` in the pattern. To get rid of this warning, ` +
            `please change the route path to "${path.replace(/\*$/, "/*")}".`,
    );

    const paramNames: string[] = [];
    let regexpSource =
        "^" +
        path
            .replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
            .replace(/^\/*/, "/") // Make sure it has a leading /
            .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
            .replace(/:(\w+)/g, (_: string, paramName: string) => {
                paramNames.push(paramName);
                return "([^\\/]+)";
            });

    if (path.endsWith("*")) {
        paramNames.push("*");
        regexpSource +=
            path === "*" || path === "/*"
                ? "(.*)$" // Already matched the initial /, just match the rest
                : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
    } else {
        regexpSource += end
            ? "\\/*$" // When matching to the end, ignore trailing slashes
            : // Otherwise, match a word boundary or a proceeding /. The word boundary restricts
              // parent routes to matching only their own words and nothing more, e.g. parent
              // route "/home" should not match "/home2".
              "(?:\\b|\\/|$)";
    }

    const matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");

    return [matcher, paramNames];
}

function safelyDecodeURIComponent(value: string, paramName: string) {
    try {
        return decodeURIComponent(value);
    } catch (error) {
        warning(
            false,
            `The value for the URL param "${paramName}" will not be decoded because` +
                ` the string "${value}" is a malformed URL segment. This is probably` +
                ` due to a bad percent encoding (${error}).`,
        );

        return value;
    }
}

/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/docs/en/v6/api#resolvepath
 */
export function resolvePath(to: To, fromPathname = "/"): Path {
    const {
        pathname: toPathname,
        search = "",
        hash = "",
    } = typeof to === "string" ? parsePath(to) : to;

    const pathname = toPathname
        ? toPathname.startsWith("/")
            ? toPathname
            : resolvePathname(toPathname, fromPathname)
        : fromPathname;

    return {
        pathname,
        search: normalizeSearch(search),
        hash: normalizeHash(hash),
    };
}

export function resolvePathname(
    relativePath: string,
    fromPathname: string,
): string {
    const segments = fromPathname.replace(/\/+$/, "").split("/");
    const relativeSegments = relativePath.split("/");

    relativeSegments.forEach((segment) => {
        if (segment === "..") {
            // Keep the root "" segment so the pathname starts at /
            if (segments.length > 1) segments.pop();
        } else if (segment !== ".") {
            segments.push(segment);
        }
    });

    return segments.length > 1 ? segments.join("/") : "/";
}

export function resolveTo(
    toArg: To,
    routePathnames: string[],
    locationPathname: string,
): Path {
    const to = typeof toArg === "string" ? parsePath(toArg) : toArg;
    const toPathname = toArg === "" || to.pathname === "" ? "/" : to.pathname;

    // If a pathname is explicitly provided in `to`, it should be relative to the
    // route context. This is explained in `Note on `<Link to>` values` in our
    // migration guide from v5 as a means of disambiguation between `to` values
    // that begin with `/` and those that do not. However, this is problematic for
    // `to` values that do not provide a pathname. `to` can simply be a search or
    // hash string, in which case we should assume that the navigation is relative
    // to the current location's pathname and *not* the route pathname.
    let from: string;
    if (toPathname == null) {
        from = locationPathname;
    } else {
        let routePathnameIndex = routePathnames.length - 1;

        if (toPathname.startsWith("..")) {
            const toSegments = toPathname.split("/");

            // Each leading .. segment means "go up one route" instead of "go up one
            // URL segment".  This is a key difference from how <a href> works and a
            // major reason we call this a "to" value instead of a "href".
            while (toSegments[0] === "..") {
                toSegments.shift();
                routePathnameIndex -= 1;
            }

            to.pathname = toSegments.join("/");
        }

        // If there are more ".." segments than parent routes, resolve relative to
        // the root / URL.
        from =
            routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
    }

    const path = resolvePath(to, from);

    // Ensure the pathname has a trailing slash if the original to value had one.
    if (
        toPathname &&
        toPathname !== "/" &&
        toPathname.endsWith("/") &&
        !path.pathname.endsWith("/")
    ) {
        path.pathname += "/";
    }

    return path;
}

export function getToPathname(to: To): string | undefined {
    // Empty strings should be treated the same as / paths
    return to === "" || (to as Path).pathname === ""
        ? "/"
        : typeof to === "string"
        ? parsePath(to).pathname
        : to.pathname;
}

export function stripBasename(
    pathname: string,
    basename: string,
): string | null {
    if (basename === "/") return pathname;

    if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
        return null;
    }

    const nextChar = pathname.charAt(basename.length);
    if (nextChar && nextChar !== "/") {
        // pathname does not start with basename/
        return null;
    }

    return pathname.slice(basename.length) || "/";
}

export const joinPaths = (paths: string[]): string =>
    paths.join("/").replace(/\/\/+/g, "/");

export const normalizePathname = (pathname: string): string =>
    pathname.replace(/\/+$/, "").replace(/^\/*/, "/");

export const normalizeSearch = (search: string): string =>
    !search || search === "?"
        ? ""
        : search.startsWith("?")
        ? search
        : "?" + search;

export const normalizeHash = (hash: string): string =>
    !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;

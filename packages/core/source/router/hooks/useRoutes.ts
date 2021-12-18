/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from "react";
import { parsePath } from "history";

import type { RouteObject } from "../utils";

import {
    invariant,
    warningOnce,
    matchRoutes,
    warning,
    _renderMatches,
    joinPaths,
} from "../utils";
import { RouteContext } from "../components";
import useInRouterContext from "./useInRouterContext";
import useLocation from "./useLocation";

declare const __DEV__: boolean;

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useroutes
 */
export function useRoutes(
    routes: RouteObject[],
    locationArg?: Partial<Location> | string,
): React.ReactElement | null {
    invariant(
        useInRouterContext(),
        // TODO: This error is probably because they somehow have 2 versions of the
        // router loaded. We can help them understand how to avoid that.
        `useRoutes() may be used only in the context of a <Router> component.`,
    );
    const { matches: parentMatches } = useContext(RouteContext);
    const routeMatch = parentMatches[parentMatches.length - 1];
    const parentParams = routeMatch ? routeMatch.params : {};
    const parentPathname = routeMatch ? routeMatch.pathname : "/";
    const parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
    const parentRoute = routeMatch && routeMatch.route;
    if (__DEV__) {
        // You won't get a warning about 2 different <Routes> under a <Route>
        // without a trailing *, but this is a best-effort warning anyway since we
        // cannot even give the warning unless they land at the parent route.
        //
        // Example:
        //
        // <Routes>
        //   {/* This route path MUST end with /* because otherwise
        //       it will never match /blog/post/123 */}
        //   <Route path="blog" element={<Blog />} />
        //   <Route path="blog/feed" element={<BlogFeed />} />
        // </Routes>
        //
        // function Blog() {
        //   return (
        //     <Routes>
        //       <Route path="post/:id" element={<Post />} />
        //     </Routes>
        //   );
        // }
        const parentPath = (parentRoute && parentRoute.path) || "";
        warningOnce(
            parentPathname,
            !parentRoute || parentPath.endsWith("*"),
            `You rendered descendant <Routes> (or called \`useRoutes()\`) at ` +
                `"${parentPathname}" (under <Route path="${parentPath}">) but the ` +
                `parent route path has no trailing "*". This means if you navigate ` +
                `deeper, the parent won't match anymore and therefore the child ` +
                `routes will never render.\n\n` +
                `Please change the parent <Route path="${parentPath}"> to <Route ` +
                `path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`,
        );
    }

    const locationFromContext = useLocation();

    let location;
    if (locationArg) {
        const parsedLocationArg =
            typeof locationArg === "string"
                ? parsePath(locationArg)
                : locationArg;

        invariant(
            parentPathnameBase === "/" ||
                parsedLocationArg.pathname?.startsWith(parentPathnameBase),
            `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, ` +
                `the location pathname must begin with the portion of the URL pathname that was ` +
                `matched by all parent routes. The current pathname base is "${parentPathnameBase}" ` +
                `but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`,
        );

        location = parsedLocationArg;
    } else {
        location = locationFromContext;
    }

    const pathname = location.pathname || "/";
    const remainingPathname =
        parentPathnameBase === "/"
            ? pathname
            : pathname.slice(parentPathnameBase.length) || "/";
    const matches = matchRoutes(routes, { pathname: remainingPathname });

    if (__DEV__) {
        warning(
            parentRoute || matches != null,
            `No routes matched location "${location.pathname}${location.search}${location.hash}" `,
        );

        warning(
            matches == null ||
                matches[matches.length - 1].route.element !== undefined,
            `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element. ` +
                `This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
        );
    }

    return _renderMatches(
        matches &&
            matches.map((match) =>
                Object.assign({}, match, {
                    params: Object.assign({}, parentParams, match.params),
                    pathname: joinPaths([parentPathnameBase, match.pathname]),
                    pathnameBase:
                        match.pathnameBase === "/"
                            ? parentPathnameBase
                            : joinPaths([
                                  parentPathnameBase,
                                  match.pathnameBase,
                              ]),
                }),
            ),
        parentMatches,
    );
}

export default useRoutes;

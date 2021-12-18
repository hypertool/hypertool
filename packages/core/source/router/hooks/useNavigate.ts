/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { To } from "history";

import { useEffect, useRef, useCallback, useContext } from "react";

import { invariant, resolveTo, joinPaths, warning } from "../utils";
import { RouteContext, NavigationContext } from "../components";
import useInRouterContext from "./useInRouterContext";
import useLocation from "./useLocation";

/**
 * The interface for the navigate() function returned from useNavigate().
 */
export interface NavigateFunction {
    (to: To, options?: NavigateOptions): void;
    (delta: number): void;
}

export interface NavigateOptions {
    replace?: boolean;
    state?: any;
}

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usenavigate
 */
function useNavigate(): NavigateFunction {
    invariant(
        useInRouterContext(),
        // TODO: This error is probably because they somehow have 2 versions of the
        // router loaded. We can help them understand how to avoid that.
        `useNavigate() may be used only in the context of a <Router> component.`,
    );
    const { basename, navigator } = useContext(NavigationContext);
    const { matches } = useContext(RouteContext);
    const { pathname: locationPathname } = useLocation();
    const routePathnamesJson = JSON.stringify(
        matches.map((match) => match.pathnameBase),
    );
    const activeRef = useRef(false);
    useEffect(() => {
        activeRef.current = true;
    });
    const navigate: NavigateFunction = useCallback(
        (to: To | number, options: NavigateOptions = {}) => {
            warning(
                activeRef.current,
                `You should call navigate() in a useEffect(), not when ` +
                    `your component is first rendered.`,
            );
            if (!activeRef.current) return;
            if (typeof to === "number") {
                navigator.go(to);
                return;
            }
            const path = resolveTo(
                to,
                JSON.parse(routePathnamesJson),
                locationPathname,
            );
            if (basename !== "/") {
                path.pathname = joinPaths([basename, path.pathname]);
            }
            (options.replace ? navigator.replace : navigator.push)(
                path,
                options.state,
            );
        },
        [basename, navigator, routePathnamesJson, locationPathname],
    );
    return navigate;
}

export default useNavigate;

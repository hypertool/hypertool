/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from "react";

import type { PathPattern, PathMatch } from "../utils";

import { invariant, matchPath } from "../utils";
import useInRouterContext from "./useInRouterContext";
import useLocation from "./useLocation";

type ParamParseFailed = { failed: true };

type ParamParseSegment<Segment extends string> =
    // Check here if there exists a forward slash in the string.
    Segment extends `${infer LeftSegment}/${infer RightSegment}`
        ? // If there is a forward slash, then attempt to parse each side of the
          // forward slash.
          ParamParseSegment<LeftSegment> extends infer LeftResult
            ? ParamParseSegment<RightSegment> extends infer RightResult
                ? LeftResult extends string
                    ? // If the left side is successfully parsed as a param, then check if
                      // the right side can be successfully parsed as well. If both sides
                      // can be parsed, then the result is a union of the two sides
                      // (read: "foo" | "bar").
                      RightResult extends string
                        ? LeftResult | RightResult
                        : LeftResult
                    : // If the left side is not successfully parsed as a param, then check
                    // if only the right side can be successfully parse as a param. If it
                    // can, then the result is just right, else it's a failure.
                    RightResult extends string
                    ? RightResult
                    : ParamParseFailed
                : ParamParseFailed
            : // If the left side didn't parse into a param, then just check the right
            // side.
            ParamParseSegment<RightSegment> extends infer RightResult
            ? RightResult extends string
                ? RightResult
                : ParamParseFailed
            : ParamParseFailed
        : // If there's no forward slash, then check if this segment starts with a
        // colon. If it does, then this is a dynamic segment, so the result is
        // just the remainder of the string. Otherwise, it's a failure.
        Segment extends `:${infer Remaining}`
        ? Remaining
        : ParamParseFailed;
// Attempt to parse the given string segment. If it fails, then just return the
// plain string type as a default fallback. Otherwise return the union of the
// parsed string literals that were referenced as dynamic segments in the route.
export type ParamParseKey<Segment extends string> =
    ParamParseSegment<Segment> extends string
        ? ParamParseSegment<Segment>
        : string;

/**
 * Returns true if the URL for the given "to" value matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * <NavLink>.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usematch
 */
function useMatch<ParamKey extends ParamParseKey<Path>, Path extends string>(
    pattern: PathPattern<Path> | Path,
): PathMatch<ParamKey> | null {
    invariant(
        useInRouterContext(),
        // TODO: This error is probably because they somehow have 2 versions of the
        // router loaded. We can help them understand how to avoid that.
        `useMatch() may be used only in the context of a <Router> component.`,
    );
    const { pathname } = useLocation();
    return useMemo(
        () => matchPath<ParamKey, Path>(pattern, pathname),
        [pathname, pattern],
    );
}

export default useMatch;

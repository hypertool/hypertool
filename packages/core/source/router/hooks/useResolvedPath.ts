/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { To, Path } from "history";

import { useContext, useMemo } from "react";

import { resolveTo } from "../utils";
import { RouteContext } from "../components";
import useLocation from "./useLocation";

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useresolvedpath
 */
function useResolvedPath(to: To): Path {
    const { matches } = useContext(RouteContext);
    const { pathname: locationPathname } = useLocation();
    const routePathnamesJson = JSON.stringify(
        matches.map((match) => match.pathnameBase),
    );
    return useMemo(
        () => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname),
        [to, routePathnamesJson, locationPathname],
    );
}

export default useResolvedPath;

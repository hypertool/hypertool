/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { To } from "history";

import { useContext } from "react";

import { invariant, getToPathname, joinPaths } from "../utils";
import useInRouterContext from "./useInRouterContext";
import useResolvedPath from "./useResolvedPath";
import { NavigationContext } from "../components";

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usehref
 */
function useHref(to: To): string {
    invariant(
        useInRouterContext(),
        // TODO: This error is probably because they somehow have 2 versions of the
        // router loaded. We can help them understand how to avoid that.
        `useHref() may be used only in the context of a <Router> component.`,
    );

    const { basename, navigator } = useContext(NavigationContext);
    const { hash, pathname, search } = useResolvedPath(to);

    let joinedPathname = pathname;
    if (basename !== "/") {
        const toPathname = getToPathname(to);
        const endsWithSlash = toPathname != null && toPathname.endsWith("/");
        joinedPathname =
            pathname === "/"
                ? basename + (endsWithSlash ? "/" : "")
                : joinPaths([basename, pathname]);
    }

    return navigator.createHref({ pathname: joinedPathname, search, hash });
}

export default useHref;

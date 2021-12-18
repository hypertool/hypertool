/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from "react";
import { parsePath, Action as NavigationType } from "history";

import NavigationContext from "./NavigationContext";
import LocationContext from "./NavigationContext";
import { invariant, warning, normalizePathname, stripBasename } from "../utils";
import { useInRouterContext } from "../hooks";

export interface RouterProps {
    basename?: string;
    children?: React.ReactNode;
    location: Partial<Location> | string;
    navigationType?: NavigationType;
    navigator: Navigator;
    static?: boolean;
}

/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://reactrouter.com/docs/en/v6/api#router
 */
function Router({
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = NavigationType.Pop,
    navigator,
    static: staticProp = false,
}: RouterProps): React.ReactElement | null {
    invariant(
        !useInRouterContext(),
        `You cannot render a <Router> inside another <Router>.` +
            ` You should never have more than one in your app.`,
    );

    const basename = normalizePathname(basenameProp);
    const navigationContext = useMemo(
        () => ({ basename, navigator, static: staticProp }),
        [basename, navigator, staticProp],
    );

    if (typeof locationProp === "string") {
        locationProp = parsePath(locationProp);
    }

    const {
        pathname = "/",
        search = "",
        hash = "",
        state = null,
        key = "default",
    } = locationProp as any;

    const location = useMemo(() => {
        const trailingPathname = stripBasename(pathname, basename);

        if (trailingPathname == null) {
            return null;
        }

        return {
            pathname: trailingPathname,
            search,
            hash,
            state,
            key,
        };
    }, [basename, pathname, search, hash, state, key]);

    warning(
        location != null,
        `<Router basename="${basename}"> is not able to match the URL ` +
            `"${pathname}${search}${hash}" because it does not start with the ` +
            `basename, so the <Router> won't render anything.`,
    );

    if (location == null) {
        return null;
    }

    return (
        <NavigationContext.Provider value={navigationContext as any}>
            <LocationContext.Provider
                children={children}
                value={{ location, navigationType } as any}
            />
        </NavigationContext.Provider>
    );
}

export default Router;

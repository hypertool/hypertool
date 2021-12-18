/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ReactElement } from "react";

import { invariant } from "../utils";

export interface RouteProps {
    caseSensitive?: boolean;
    children?: React.ReactNode;
    element?: React.ReactNode | null;
    index?: boolean;
    path?: string;
}

export interface PathRouteProps {
    caseSensitive?: boolean;
    children?: React.ReactNode;
    element?: React.ReactNode | null;
    index?: false;
    path: string;
}

export interface LayoutRouteProps {
    children?: React.ReactNode;
    element?: React.ReactNode | null;
}

export interface IndexRouteProps {
    element?: React.ReactNode | null;
    index: true;
}

/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/docs/en/v6/api#route
 */
const Route = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _props: PathRouteProps | LayoutRouteProps | IndexRouteProps,
): ReactElement | null => {
    invariant(
        false,
        `A <Route> is only ever to be used as the child of <Routes> element, ` +
            `never rendered directly. Please wrap your <Route> in a <Routes>.`,
    );
};

export default Route;

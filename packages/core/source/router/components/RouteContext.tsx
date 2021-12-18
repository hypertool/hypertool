/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ReactElement } from "react";

import { createContext } from "react";

import type { RouteMatch } from "../utils";

export interface RouteContextObject {
    outlet: ReactElement | null;
    matches: RouteMatch[];
}

const RouteContext = createContext<RouteContextObject>({
    outlet: null,
    matches: [],
});
RouteContext.displayName = "Route";

export default RouteContext;

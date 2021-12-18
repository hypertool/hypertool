/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { History } from "history";

import { createContext } from "react";

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */
export type Navigator = Pick<History, "go" | "push" | "replace" | "createHref">;

export interface NavigationContextObject {
    basename: string;
    navigator: Navigator;
    static: boolean;
}

const NavigationContext = createContext<NavigationContextObject>(null!);
NavigationContext.displayName = "Navigation";

export default NavigationContext;

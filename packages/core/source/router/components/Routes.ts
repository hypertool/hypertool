/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRoutes } from "../hooks";
import { createRoutesFromChildren } from "../utils";

export interface RoutesProps {
    children?: React.ReactNode;
    location?: Partial<Location> | string;
}

/**
 * A container for a nested tree of <Route> elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/api#routes
 */
function Routes({
    children,
    location,
}: RoutesProps): React.ReactElement | null {
    return useRoutes(createRoutesFromChildren(children), location);
}

export default Routes;

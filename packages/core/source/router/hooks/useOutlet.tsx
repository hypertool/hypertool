/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from "react";

import { RouteContext } from "../components";
import { OutletContext } from "./useOutletContext";

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useoutlet
 */
function useOutlet(context?: unknown): React.ReactElement | null {
    const outlet = useContext(RouteContext).outlet;
    if (outlet) {
        return (
            <OutletContext.Provider value={context}>
                {outlet}
            </OutletContext.Provider>
        );
    }
    return outlet;
}

export default useOutlet;

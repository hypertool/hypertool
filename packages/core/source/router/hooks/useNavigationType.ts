/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from "react";

import { LocationContext } from "../components";

/**
 * Returns the current navigation action which describes how the router came to
 * the current location, either by a pop, push, or replace on the history stack.
 *
 * @see https://reactrouter.com/docs/en/v6/api#usenavigationtype
 */
function useNavigationType(): NavigationType {
    return useContext(LocationContext).navigationType;
}

export default useNavigationType;

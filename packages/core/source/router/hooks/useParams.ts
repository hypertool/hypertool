/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from "react";

import { Params } from "../utils";
import { RouteContext } from "../components";

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/docs/en/v6/api#useparams
 */
function useParams<
    ParamsOrKey extends string | Record<string, string | undefined> = string,
>(): Readonly<
    [ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>
> {
    const { matches } = useContext(RouteContext);
    const routeMatch = matches[matches.length - 1];
    return routeMatch ? (routeMatch.params as any) : {};
}

export default useParams;

/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { To } from "history";

import { useContext, useEffect } from "react";

import { invariant, warning } from "../utils";
import { useInRouterContext, useNavigate } from "../hooks";
import NavigationContext from "./NavigationContext";

export interface NavigateProps {
    to: To;
    replace?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state?: any;
}

/**
 * Changes the current location.
 *
 * Note: This API is mostly useful in `React.Component` subclasses that are not
 * able to use hooks. In functional components, we recommend you use the
 * `useNavigate` hook instead.
 *
 * @see https://reactrouter.com/docs/en/v6/api#navigate
 */
const Navigate = (props: NavigateProps): null => {
    const { to, replace, state } = props;

    invariant(
        useInRouterContext(),
        // TODO: This error is probably because they somehow have 2 versions of
        // the router loaded. We can help them understand how to avoid that.
        `<Navigate> may be used only in the context of a <Router> component.`,
    );

    warning(
        !useContext(NavigationContext).static,
        `<Navigate> must not be used on the initial render in a <StaticRouter>. ` +
            `This is a no-op, but you should modify your code so the <Navigate> is ` +
            `only ever rendered in response to some user interaction or state change.`,
    );

    const navigate = useNavigate();
    useEffect(() => {
        navigate(to, { replace, state });
    });

    return null;
};

export default Navigate;

/**
 * Copyright (c) 2015 - 2019, React Training
 * Copyright (c) 2020 - 2021, Remix Software
 * Copyright (c) 2021 - present, Hypertool <hello@hypertool.io>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ReactElement } from "react";
import type { InitialEntry, MemoryHistory } from "history";

import { useRef, useState, useLayoutEffect } from "react";
import { createMemoryHistory } from "history";
import Router from "./Router";

export interface MemoryRouterProps {
    basename?: string;
    children?: React.ReactNode;
    initialEntries?: InitialEntry[];
    initialIndex?: number;
}

/**
 * A <Router> that stores all entries in memory.
 *
 * @see https://reactrouter.com/docs/en/v6/api#memoryrouter
 */
const MemoryRouter = (props: MemoryRouterProps): ReactElement => {
    const { basename, children, initialEntries, initialIndex } = props;
    const historyRef = useRef<MemoryHistory>();
    if (historyRef.current == null) {
        historyRef.current = createMemoryHistory({
            initialEntries,
            initialIndex,
        });
    }

    const history = historyRef.current;
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });

    useLayoutEffect(() => history.listen(setState), [history]);

    return (
        <Router
            basename={basename}
            children={children}
            location={state.location}
            navigationType={state.action}
            navigator={history as any}
        />
    );
};

export default MemoryRouter;

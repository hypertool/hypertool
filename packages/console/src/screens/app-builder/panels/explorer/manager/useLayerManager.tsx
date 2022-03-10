import { useContext, useMemo } from "react";

import { useCollector } from "../../../../../craft-utils";
import { LayerState } from "../interfaces";

import { LayerManagerContext } from "./context";

export const useLayerManager = <C,>(collector?: (state: LayerState) => C) => {
    const { store } = useContext(LayerManagerContext);
    const collected = useCollector(store, collector);

    return useMemo(
        () => ({
            store,
            ...collected,
        }),
        [store, collected],
    );
};

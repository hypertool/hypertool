import React from "react";

import { DefaultLayer } from "../../../../../craft-layers";
import { useMethods } from "../../../../../craft-utils";
import { LayerEventContextProvider } from "../events";
import { LayerOptions } from "../interfaces";

import { LayerMethods } from "./actions";
import { LayerManagerContext, LayerStore } from "./context";

export const LayerManagerProvider: React.FC<{
    options: Partial<LayerOptions>;
}> = ({ children, options }) => {
    // TODO: fix type
    const store = useMethods(LayerMethods, {
        layers: {},
        events: {
            selected: null,
            dragged: null,
            hovered: null,
        },
        options: {
            renderLayer: DefaultLayer,
            ...options,
        },
    }) as LayerStore;

    return (
        <LayerManagerContext.Provider value={{ store }}>
            <LayerEventContextProvider>{children}</LayerEventContextProvider>
        </LayerManagerContext.Provider>
    );
};

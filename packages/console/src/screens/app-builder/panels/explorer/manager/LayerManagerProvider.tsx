import React from "react";

import { useMethods } from "../../../../../craft-utils";
import { LayerEventContextProvider } from "../events";
import { LayerOptions } from "../interfaces";
import { DefaultLayer } from "../layers/index";

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

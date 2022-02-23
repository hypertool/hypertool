import { createContext } from "react";

import { SubscriberAndCallbacksFor } from "@craftjs/utils";

import { LayerMethods } from "./actions";

export type LayerStore = SubscriberAndCallbacksFor<typeof LayerMethods>;
export type TLayerManagerContext = {
    store: LayerStore;
};

export const LayerManagerContext = createContext<TLayerManagerContext>(
    {} as TLayerManagerContext,
);

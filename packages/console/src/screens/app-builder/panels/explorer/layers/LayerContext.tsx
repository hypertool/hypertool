import React from "react";

import { EventHandlerConnectors } from "@craftjs/utils";

import { TNodeID } from "../../../../../craft";
import { LayerHandlers } from "../events/LayerHandlers";

export type TLayerContext = {
    id: TNodeID;
    depth: number;
    connectors: EventHandlerConnectors<LayerHandlers, React.ReactElement>;
};

export const LayerContext = React.createContext<TLayerContext>(
    {} as TLayerContext,
);

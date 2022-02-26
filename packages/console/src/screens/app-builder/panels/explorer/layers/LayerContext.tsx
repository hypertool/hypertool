import React from "react";

import { NodeId } from "@craftjs/core";
import { EventHandlerConnectors } from "@craftjs/utils";

import { LayerHandlers } from "../events/LayerHandlers";

export type TLayerContext = {
    id: NodeId;
    depth: number;
    connectors: EventHandlerConnectors<LayerHandlers, React.ReactElement>;
};

export const LayerContext = React.createContext<TLayerContext>(
    {} as TLayerContext,
);

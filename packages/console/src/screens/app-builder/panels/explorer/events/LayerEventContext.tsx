import { createContext, useContext } from "react";

import { LayerHandlers } from "./LayerHandlers";

export const LayerEventHandlerContext = createContext<LayerHandlers | null>(
    null,
);

export const useLayerEventHandler = () => useContext(LayerEventHandlerContext);

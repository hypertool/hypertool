import type { FunctionComponent, ReactElement, ReactNode } from "react";
import { useMemo } from "react";

import { useEventHandler } from "@craftjs/core";

import { useLayerManager } from "../manager";

import { LayerEventHandlerContext } from "./LayerEventContext";
import { LayerHandlers } from "./LayerHandlers";
import { RenderLayerIndicator } from "./RenderLayerIndicator";

export interface Props {
    children?: ReactNode;
}

export const LayerEventContextProvider: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { children } = props;
    const { store } = useLayerManager();
    const eventHandler = useEventHandler();

    const handler = useMemo(
        () =>
            eventHandler.derive(LayerHandlers, {
                layerStore: store,
            }),
        [eventHandler, store],
    );

    return (
        <LayerEventHandlerContext.Provider value={handler}>
            <RenderLayerIndicator />
            {children}
        </LayerEventHandlerContext.Provider>
    );
};

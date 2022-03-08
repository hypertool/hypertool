import { Indicator, NodeId } from "@craftjs/core";

export type TLayer = {
    id: NodeId;
    dom: HTMLElement;
    headingDom: HTMLElement;
    expanded: boolean;
    event: TLayerRefEvents;
};

export type TLayerRefEvents = Record<TLayerEvents, boolean>;

export type TLayerEvents = "selected" | "hovered";

export type TLayerOptions = {
    expandRootOnLoad: boolean;
    renderLayer: React.ElementType;
};

export type TLayerIndicator = Indicator & {
    onCanvas: boolean;
};

export type TLayerState = {
    layers: Record<NodeId, TLayer>;
    events: Record<TLayerEvents, NodeId | null> & {
        indicator: TLayerIndicator;
    };

    options: TLayerOptions;
};

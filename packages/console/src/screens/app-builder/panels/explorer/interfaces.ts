import { Indicator, TNodeID } from "../../../../craft";

export type Layer = {
    id: TNodeID;
    dom: HTMLElement;
    headingDom: HTMLElement;
    expanded: boolean;
    event: LayerRefEvents;
};

export type LayerRefEvents = Record<LayerEvents, boolean>;

export type LayerEvents = "selected" | "hovered";

export type LayerOptions = {
    expandRootOnLoad: boolean;
    renderLayer: React.ElementType;
};

export type LayerIndicator = Indicator & {
    onCanvas: boolean;
};

export type LayerState = {
    layers: Record<TNodeID, Layer>;
    events: Record<LayerEvents, TNodeID | null> & {
        indicator: LayerIndicator;
    };

    options: LayerOptions;
};

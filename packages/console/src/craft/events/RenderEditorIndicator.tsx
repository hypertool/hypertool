import React, { useEffect } from "react";

import { RenderIndicator, getDOMInfo } from "@craftjs/utils";

import { useInternalEditor } from "../editor/useInternalEditor";

import { useEventHandler } from "./EventContext";
import movePlaceholder from "./movePlaceholder";

export const RenderEditorIndicator = () => {
    const { indicator, indicatorOptions, enabled } = useInternalEditor(
        (state) => ({
            indicator: state.indicator,
            indicatorOptions: state.options.indicator,
            enabled: state.options.enabled,
        }),
    );

    const handler = useEventHandler();

    useEffect(() => {
        if (!handler) {
            return;
        }

        if (!enabled) {
            handler.disable();
            return;
        }

        handler.enable();
    }, [enabled, handler]);

    if (!indicator) {
        return null;
    }

    return React.createElement(RenderIndicator, {
        style: {
            ...movePlaceholder(
                indicator.placement,
                getDOMInfo(indicator.placement.parent.dom as any),
                indicator.placement.currentNode &&
                    getDOMInfo(indicator.placement.currentNode.dom as any),
                indicatorOptions.thickness,
            ),
            backgroundColor: indicator.error
                ? indicatorOptions.error
                : indicatorOptions.success,
            transition: indicatorOptions.transition || "0.2s ease-in",
        },
        parentDom: indicator.placement.parent.dom,
    });
};

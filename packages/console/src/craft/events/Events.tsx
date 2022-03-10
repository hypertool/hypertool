import React, { useContext, useMemo } from "react";

import { EditorContext } from "../editor/EditorContext";

import { EventHandlerContext } from "./EventContext";
import { RenderEditorIndicator } from "./RenderEditorIndicator";

export const Events: React.FC = ({ children }) => {
    const store = useContext(EditorContext);

    const handler = useMemo(
        () => store.query.getOptions().handlers(store),
        [store],
    );

    if (!handler) {
        return null;
    }

    return (
        <EventHandlerContext.Provider value={handler}>
            <RenderEditorIndicator />
            {children}
        </EventHandlerContext.Provider>
    );
};

import { createContext } from "react";

import { IBuilderActionsContext } from "../types";

const BuilderActionsContext = createContext<IBuilderActionsContext>({
    createNewQuery: () => {
        throw new Error("Implementation for this operation is missing.");
    },
    tabs: [],
    activeTab: null,
    setActiveTab: () => {
        throw new Error("Implementation for this operation is missing.");
    },
});

export default BuilderActionsContext;

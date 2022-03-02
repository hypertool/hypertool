import { createContext } from "react";

import { IBuilderActionsContext, TTabType } from "../types";

const BuilderActionsContext = createContext<IBuilderActionsContext>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createNewTab: (_title: string, _type: TTabType) => {
        throw new Error("Implementation for this operation is missing.");
    },
    tabs: [],
    activeTab: null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setActiveTab: (_activeTab: string) => {
        throw new Error("Implementation for this operation is missing.");
    },
});

export default BuilderActionsContext;

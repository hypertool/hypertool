import { createContext } from "react";

import { IBuilderActionsContext, TBundleType, TTabType } from "../types";

const BuilderActionsContext = createContext<IBuilderActionsContext>({
    tabs: [],
    activeTab: null,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    insertTab: (
        _index: number,
        _replace: boolean,
        _type: TTabType,
        _bundle?: TBundleType,
    ): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createTab: (_type: TTabType, _bundle?: TBundleType): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    replaceTab: (
        _index: number,
        _type: TTabType,
        _bundle?: TBundleType,
    ): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setTabTitle: (_index: number, _title: string): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setActiveTab: (_activeTab: string) => {
        throw new Error("Implementation for this operation is missing.");
    },
});

export default BuilderActionsContext;

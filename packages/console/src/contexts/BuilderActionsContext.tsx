/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

import {
    IApp,
    IBuilderActionsContext,
    ITab,
    TBundleType,
    TPredicate,
    TTabType,
} from "../types";

const BuilderActionsContext = createContext<IBuilderActionsContext>({
    tabs: [],
    activeTab: null,

    getApp: (): IApp => {
        throw new Error("Implementation for this operation is missing.");
    },

    insertTab: (
        _index: number,
        _replace: boolean,
        _type: TTabType,
        _bundle?: TBundleType,
    ): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    createTab: (_type: TTabType, _bundle?: TBundleType): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    replaceTab: (
        _index: number,
        _type: TTabType,
        _bundle?: TBundleType,
    ): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    setTabTitle: (_index: number, _title: string): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    setActiveTab: (_activeTab: string): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    closeTab: (_index: number): void => {
        throw new Error("Implementation for this operation is missing.");
    },

    closeTabs: (_predicate: TPredicate<ITab>): void => {
        throw new Error("Implementation for this operation is missing.");
    },
});

export default BuilderActionsContext;

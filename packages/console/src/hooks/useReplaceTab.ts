import { useContext, useEffect } from "react";

import { BuilderActionsContext, TabContext } from "../contexts";
import { TBundleType, TTabType } from "../types";

const useReplaceTab = (
    replace: boolean,
    tabType: TTabType,
    tabBundle: TBundleType,
): void => {
    const { replaceTab } = useContext(BuilderActionsContext);
    const error = () => {
        throw new Error("Tab context should not be null.");
    };
    const { index } = useContext(TabContext) || error();

    useEffect(() => {
        if (replace) {
            replaceTab(index, tabType, tabBundle);
        }
    }, [index, replace, replaceTab]);
};

export default useReplaceTab;

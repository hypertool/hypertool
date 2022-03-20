import { useContext } from "react";

import { TabContext } from "../contexts";
import { TBundleType } from "../types";

const useTabBundle = <T extends TBundleType>(): T => {
    const context = useContext(TabContext);

    if (!context) {
        throw new Error("Cannot find tab context.");
    }

    if (!context.tab.bundle) {
        throw new Error("Cannot find tab bundle.");
    }

    return context.tab.bundle as T;
};

export default useTabBundle;

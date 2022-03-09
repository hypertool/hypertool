import { useContext } from "react";

import { TabContext } from "../contexts";
import { ITabContext } from "../types";

const useTabContext = (): ITabContext => {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error("Cannot find tab context.");
    }

    return context;
};

export default useTabContext;

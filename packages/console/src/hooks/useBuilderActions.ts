import { useContext } from "react";

import { BuilderActionsContext } from "../contexts";
import type { IBuilderActionsContext } from "../types";

const useBuilderActions = (): IBuilderActionsContext => {
    const context = useContext(BuilderActionsContext);
    /*
     * NOTE: Currently, the builder actions context provides a dummy implementation
     * that throws exception for all the functions. So, there is no point of checking
     * for null.
     */
    if (!context) {
        throw new Error("Cannot find builder actions context.");
    }

    return context;
};

export default useBuilderActions;

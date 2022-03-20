import { useContext } from "react";

import lodash from "lodash";

import { ModulesContext } from "../contexts";
import { ISymbolReference } from "../types";

const useSymbolReference = (reference?: ISymbolReference): any | undefined => {
    if (!reference) {
        return undefined;
    }

    const modules = useContext(ModulesContext);
    const module = modules[reference.moduleId];
    if (!module) {
        throw new Error(`Cannot find module with ID "${reference.moduleId}"`);
    }

    return lodash.get(module.object, reference.target);
};

export default useSymbolReference;

import { useContext, useMemo } from "react";

import { ModulesContext } from "../contexts";

const useModulesArray = () => {
    const modules = useContext(ModulesContext);
    return useMemo(
        () => Object.keys(modules).map((artifactId) => modules[artifactId]),
        [],
    );
};

export default useModulesArray;

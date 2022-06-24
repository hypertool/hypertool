import { useMemo } from "react";
import type { ISourceFile } from "../types";
import useBuilderActions from "./useBuilderActions";

const useSourceFile = (name: string): ISourceFile => {
    const actions = useBuilderActions();
    const result = useMemo(
        () =>
            actions
                .getApp()
                .sourceFiles.find((sourceFile) => sourceFile.name === name),
        [actions, name],
    );

    if (!result) {
        throw new Error(`Cannot find source file with name "${name}".`);
    }
    return result;
};

export default useSourceFile;

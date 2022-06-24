import { useMemo } from "react";
import type { ISourceFile } from "../types";
import useApp from "./useApp";

const useSourceFile = (name: string): ISourceFile => {
    const app = useApp();
    const result = useMemo(
        () => app.sourceFiles.find((sourceFile) => sourceFile.name === name),
        [app.sourceFiles, name],
    );

    if (!result) {
        throw new Error(`Cannot find source file with name "${name}".`);
    }
    return result;
};

export default useSourceFile;

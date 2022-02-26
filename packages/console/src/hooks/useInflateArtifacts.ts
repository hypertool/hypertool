import { useMemo } from "react";

import type { IArtifact, IArtifactsContext, IDeflatedArtifact } from "../types";

/* TODO: Do not inflate an artifact if the source code has not changed
 * since previous inflation.
 */
const useInflateArtifacts = (
    deflatedArtifacts: IDeflatedArtifact[],
): IArtifactsContext =>
    useMemo(() => {
        const result: { [artifactId: string]: IArtifact } = {};
        for (const deflatedArtifact of deflatedArtifacts) {
            try {
                // eslint-disable-next-line no-eval
                const initializer = eval(deflatedArtifact.code);
                const artifact: IArtifact = {
                    ...deflatedArtifact,
                    object: initializer(),
                };
                result[deflatedArtifact.id] = artifact;
            } catch (error) {
                console.log(error);
            }
        }
        return result;
    }, [deflatedArtifacts]);

export default useInflateArtifacts;

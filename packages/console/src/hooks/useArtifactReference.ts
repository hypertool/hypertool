import { useContext } from "react";

import lodash from "lodash";

import { ArtifactsContext } from "../contexts";

const useArtifactReference = (
    artifactId: string,
    path?: string,
): any | undefined => {
    if (!path) {
        return undefined;
    }

    const artifacts = useContext(ArtifactsContext);
    const artifact = artifacts[artifactId];
    if (!artifact) {
        throw new Error(`Cannot find artifact with ID "${artifactId}"`);
    }

    return lodash.get(artifact.object, path);
};

export default useArtifactReference;

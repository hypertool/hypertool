import { useContext } from "react";

import lodash from "lodash";

import ArtifactContext from "../screens/app-builder/ArtifactContext";

const useArtifactReference = (
    artifactId: string,
    path?: string,
): any | undefined => {
    if (!path) {
        return undefined;
    }

    const artifacts = useContext(ArtifactContext);
    const artifact = artifacts[artifactId];
    if (!artifact) {
        throw new Error(`Cannot find artifact with ID "${artifactId}"`);
    }

    return lodash.get(artifact.object, path);
};

export default useArtifactReference;

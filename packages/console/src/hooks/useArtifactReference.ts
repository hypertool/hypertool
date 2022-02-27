import { useContext } from "react";

import lodash from "lodash";

import { ArtifactsContext } from "../contexts";
import { IArtifactReference } from "../types";

const useArtifactReference = (
    reference?: IArtifactReference,
): any | undefined => {
    if (!reference) {
        return undefined;
    }

    const artifacts = useContext(ArtifactsContext);
    const artifact = artifacts[reference.artifactId];
    if (!artifact) {
        throw new Error(
            `Cannot find artifact with ID "${reference.artifactId}"`,
        );
    }

    return lodash.get(artifact.object, reference.target);
};

export default useArtifactReference;

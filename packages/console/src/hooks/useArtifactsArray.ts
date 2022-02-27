import { useContext, useMemo } from "react";

import { ArtifactsContext } from "../contexts";

const useArtifactsArray = () => {
    const artifacts = useContext(ArtifactsContext);
    return useMemo(
        () => Object.keys(artifacts).map((artifactId) => artifacts[artifactId]),
        [],
    );
};

export default useArtifactsArray;

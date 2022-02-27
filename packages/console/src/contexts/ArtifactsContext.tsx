import { createContext } from "react";

import { IArtifactsContext } from "../types";

const ArtifactsContext = createContext<IArtifactsContext>({});

export default ArtifactsContext;

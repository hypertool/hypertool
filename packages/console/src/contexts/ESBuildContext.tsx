import { createContext } from "react";

import { IESBuildContext } from "../types";

const ESBuildContext = createContext<IESBuildContext | null>(null);

export default ESBuildContext;

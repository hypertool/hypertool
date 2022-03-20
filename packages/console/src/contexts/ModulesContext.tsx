import { createContext } from "react";

import { TModulesContext } from "../types";

const ModulesContext = createContext<TModulesContext>({});

export default ModulesContext;

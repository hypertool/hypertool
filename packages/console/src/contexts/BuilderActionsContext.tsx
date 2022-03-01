import { createContext } from "react";

import { IBuilderActionsContext } from "../types";

const BuilderActionsContext = createContext<IBuilderActionsContext>({});

export default BuilderActionsContext;

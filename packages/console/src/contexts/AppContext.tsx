import { createContext } from "react";

import { IApp } from "../types";

const AppContext = createContext<IApp | null>(null);

export default AppContext;

import { createContext } from "react";

import { IApp } from "../types";

const RootAppContext = createContext<IApp | null>(null);

export default RootAppContext;

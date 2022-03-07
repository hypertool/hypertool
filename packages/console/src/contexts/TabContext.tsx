import { createContext } from "react";

import { ITabContext } from "../types";

const TabContext = createContext<ITabContext | null>(null);

export default TabContext;

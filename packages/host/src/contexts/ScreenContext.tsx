import { createContext } from "react";
import type { IHyperContext } from "../types";

const ControllersContext = createContext<IHyperContext<any> | null>(null);

export default ControllersContext;

import { createContext } from "react";
import { IHyperController } from "../types";

const ControllersContext = createContext<Record<string, IHyperController<any>>>(
  {}
);

export default ControllersContext;

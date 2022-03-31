import { createContext } from "react";

const ControllersContext = createContext<Record<string, any>>({});

export default ControllersContext;
import { createContext } from "react";
import { TAppContext } from "../types";

const AppContext = createContext<TAppContext | null>(null);

export default AppContext;
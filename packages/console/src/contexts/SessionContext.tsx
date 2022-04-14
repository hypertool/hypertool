import { createContext } from "react";

import { ISessionContext } from "../types";

const SessionContext = createContext<ISessionContext | null>(null);

export default SessionContext;

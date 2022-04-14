import { useContext } from "react";

import { SessionContext } from "../contexts";
import type { ISessionContext } from "../types";

const useSession = (): ISessionContext => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("Cannot find session context.");
    }
    return context;
};

export default useSession;

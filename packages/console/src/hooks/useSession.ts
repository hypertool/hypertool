import { useContext } from "react";

import { SessionContext } from "../contexts";
import type { ISessionContext } from "../types";

const useSession = (requirePublic = false): ISessionContext => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("Cannot find session context.");
    }
    if (!requirePublic && !context.jwtToken) {
        throw new Error("Cannot use public session context.");
    }
    return context;
};

export default useSession;

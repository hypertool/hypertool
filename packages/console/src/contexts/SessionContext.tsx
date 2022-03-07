import { createContext } from "react";

import { ISessionContext } from "../types";

const SessionContext = createContext<ISessionContext>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reloadSession: () => {
        throw new Error("Implementation for this operation is missing.");
    },
});

export default SessionContext;

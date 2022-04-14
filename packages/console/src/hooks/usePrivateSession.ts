import type { IPrivateSessionContext } from "../types";

import useSession from "./useSession";

const usePrivateSession = (): IPrivateSessionContext => {
    const session = useSession(false);
    return session as IPrivateSessionContext;
};

export default usePrivateSession;

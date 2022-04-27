import { useContext } from "react";

import { NotificationContext } from "../contexts";
import { INotificationContext } from "../types";

const useNotification = (): INotificationContext => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("Cannot find notification context.");
    }

    return context;
};

export default useNotification;

import { createContext } from "react";

import { INotificationContext } from "../types";

const NotificationContext = createContext<INotificationContext | null>(null);

export default NotificationContext;

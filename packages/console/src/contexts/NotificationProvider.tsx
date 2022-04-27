import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";

import {
    CircularProgress,
    Icon,
    IconButton,
    Snackbar,
    Typography,
    useTheme,
} from "@mui/material";
import type { SnackbarCloseReason } from "@mui/material";
import { styled } from "@mui/material/styles";

import * as uuid from "uuid";

import { INotification, INotificationRequest } from "../types";

import NotificationContext from "./NotificationContext";

export interface INotificationProviderProps {
    children: ReactElement;
}

const MessageContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
}));

const MessageIcon = styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(0.5),
    color: "white",
}));

const MessageText = styled(Typography)(({ theme }) => ({
    color: "white",
    fontSize: 14,
    fontWeight: 500,
}));

const StyledCircularProgress = styled(CircularProgress)({
    color: "white",
});

const icons = {
    success: "check_circle_outline",
    warning: "warning",
    error: "error",
    info: "info",
};

const NotificationProvider: FunctionComponent<INotificationProviderProps> = (
    props: INotificationProviderProps,
): ReactElement => {
    const theme = useTheme();
    const [notification, setNotification] = useState<INotification | null>(
        null,
    );

    const handleClose = useCallback(
        (_event: any, reason: SnackbarCloseReason) => {
            if (!notification) {
                throw new Error("Callback called when notification is null.");
            }

            /* We do not allow the user to close the notification via clickaway. */
            if (reason === "clickaway") {
                return;
            }

            if (!notification.closeable && reason == "escapeKeyDown") {
                return;
            }

            notification.onClose?.(notification);
            setNotification(null);
        },
        [notification],
    );

    const handleClose0 = useCallback(() => {
        setNotification(null);
    }, []);

    const context = useMemo(
        () => ({
            notify: (request: INotificationRequest) => {
                setNotification({ id: uuid.v4(), ...request });
            },
            close: handleClose0,
        }),
        [handleClose0],
    );
    return (
        <NotificationContext.Provider value={context}>
            <Snackbar
                ContentProps={
                    notification
                        ? {
                              style: {
                                  backgroundColor:
                                      theme.palette[notification.type].dark,
                                  padding: theme.spacing(0.5, 2, 0.5, 1),
                              },
                          }
                        : undefined
                }
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={Boolean(notification)}
                autoHideDuration={
                    notification?.autoCloseDuration ?? -1 < 0
                        ? undefined
                        : notification?.autoCloseDuration
                }
                message={
                    <MessageContainer>
                        {notification && (
                            <MessageIcon>
                                {icons[notification?.type]}
                            </MessageIcon>
                        )}
                        <MessageText>{notification?.message}</MessageText>
                    </MessageContainer>
                }
                onClose={handleClose}
                action={
                    <>
                        {notification?.action}
                        {notification?.closeable && (
                            <IconButton sx={{ p: 0.5 }} onClick={handleClose0}>
                                <Icon fontSize="small">close</Icon>
                            </IconButton>
                        )}
                        {!notification?.closeable &&
                            !notification?.action &&
                            (notification?.autoCloseDuration ?? 0) < 0 && (
                                <StyledCircularProgress size="16px" />
                            )}
                    </>
                }
            />
            {props.children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;

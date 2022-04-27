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

    const handleClose = useCallback(() => {
        if (!notification) {
            throw new Error("Callback called when notification is null.");
        }

        notification.onClose?.(notification);
        setNotification(null);
    }, [notification]);

    const context = useMemo(
        () => ({
            notify: (request: INotificationRequest) => {
                setNotification({ id: uuid.v4(), ...request });
            },
            close: handleClose,
        }),
        [],
    );
    return (
        <NotificationContext.Provider value={context}>
            <Snackbar
                ContentProps={
                    notification
                        ? {
                              style: {
                                  backgroundColor:
                                      theme.palette[notification.type].main,
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
                            <IconButton sx={{ p: 0.5 }} onClick={handleClose}>
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

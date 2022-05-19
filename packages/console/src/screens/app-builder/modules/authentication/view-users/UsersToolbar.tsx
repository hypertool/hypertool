import type { FunctionComponent, ReactElement } from "react";

import {
    AppBar,
    Button,
    Icon,
    Toolbar,
    Typography,
    alpha,
    styled,
} from "@mui/material";

interface IWorkspaceToolbarProps {
    selectedCount: number;
}

const WorkspaceToolbar = styled(Toolbar)<IWorkspaceToolbarProps>(
    ({ theme, selectedCount }) => ({
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: theme.spacing(1, 0),
        ...(selectedCount > 0 && {
            backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity,
            ),
        }),
    }),
);

const Title = styled(Typography)(() => ({}));

const ActionContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing(2),
}));

const ActionIcon = styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

export interface IUsersToolbarProps {
    selectedCount: number;
    onNew: () => void;
    onRefresh: () => void;
}

const UsersToolbar: FunctionComponent<IUsersToolbarProps> = (
    props: IUsersToolbarProps,
): ReactElement => {
    const { selectedCount, onNew, onRefresh } = props;

    return (
        <AppBar position="static" elevation={1}>
            <WorkspaceToolbar selectedCount={selectedCount}>
                {selectedCount === 0 && (
                    <>
                        <Title>View Users</Title>
                        <ActionContainer>
                            <Button
                                size="small"
                                color="inherit"
                                onClick={onRefresh}
                            >
                                <ActionIcon fontSize="small">
                                    refresh
                                </ActionIcon>
                                Refresh
                            </Button>
                            <Button
                                size="small"
                                color="inherit"
                                onClick={onNew}
                            >
                                <ActionIcon fontSize="small">
                                    add_circle
                                </ActionIcon>
                                New User
                            </Button>
                        </ActionContainer>
                    </>
                )}

                {selectedCount > 0 && (
                    <>
                        <Title>{selectedCount} selected</Title>
                        <ActionContainer>
                            <Button size="small" color="inherit" sx={{ mr: 2 }}>
                                <ActionIcon fontSize="small">
                                    toggle_off
                                </ActionIcon>
                                Disable
                            </Button>
                            <Button size="small" color="inherit" sx={{ mr: 2 }}>
                                <ActionIcon fontSize="small">
                                    toggle_on
                                </ActionIcon>
                                Enable
                            </Button>
                            <Button size="small" color="inherit" sx={{ mr: 2 }}>
                                <ActionIcon fontSize="small">delete</ActionIcon>
                                Delete
                            </Button>
                        </ActionContainer>
                    </>
                )}
            </WorkspaceToolbar>
        </AppBar>
    );
};

export default UsersToolbar;

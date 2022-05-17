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

const ActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
}));

const ActionIcon = styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

export interface IProvidersToolbarProps {
    selectedCount: number;
    onNew: () => void;
}

const ProvidersToolbar: FunctionComponent<IProvidersToolbarProps> = (
    props: IProvidersToolbarProps,
): ReactElement => {
    const { selectedCount, onNew } = props;

    return (
        <AppBar position="static" elevation={1}>
            <WorkspaceToolbar selectedCount={selectedCount}>
                {selectedCount === 0 && (
                    <>
                        <Title>View Providers</Title>
                        <ActionContainer>
                            <Button size="small" color="inherit" sx={{ mr: 2 }}>
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
                                New Provider
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

export default ProvidersToolbar;

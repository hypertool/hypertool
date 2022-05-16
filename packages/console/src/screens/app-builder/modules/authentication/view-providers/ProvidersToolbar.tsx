import type { FunctionComponent, ReactElement } from "react";

import {
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
}

const ProvidersToolbar: FunctionComponent<IProvidersToolbarProps> = (
    props: IProvidersToolbarProps,
): ReactElement => {
    const { selectedCount } = props;

    return (
        <WorkspaceToolbar selectedCount={selectedCount}>
            {selectedCount === 0 && <Title>View Providers</Title>}

            {selectedCount > 0 && (
                <>
                    <Title>{selectedCount} selected</Title>
                    <ActionContainer>
                        <Button size="small" color="inherit" sx={{ mr: 2 }}>
                            <ActionIcon fontSize="small">delete</ActionIcon>
                            Delete
                        </Button>
                    </ActionContainer>
                </>
            )}
        </WorkspaceToolbar>
    );
};

export default ProvidersToolbar;

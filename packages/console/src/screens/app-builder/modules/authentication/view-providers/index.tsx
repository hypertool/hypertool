import type { FunctionComponent, ReactElement } from "react";

import { AppBar, Button, Icon, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useUpdateTabTitle } from "../../../../../hooks";

const Title = styled(Typography)(() => ({}));

const WorkspaceToolbar = styled(Toolbar)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}));

const ActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
}));

const ActionIcon = styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const ViewProviders: FunctionComponent = (): ReactElement => {
    useUpdateTabTitle("View Providers");

    return (
        <div>
            <AppBar position="static" elevation={1}>
                <WorkspaceToolbar>
                    <Title>View Providers</Title>
                    <ActionContainer>
                        <Button size="small" color="inherit" sx={{ mr: 2 }}>
                            <ActionIcon fontSize="small">refresh</ActionIcon>
                            Refresh
                        </Button>
                        <Button size="small" color="inherit">
                            <ActionIcon fontSize="small">add_circle</ActionIcon>
                            New Provider
                        </Button>
                    </ActionContainer>
                </WorkspaceToolbar>
            </AppBar>
        </div>
    );
};

export default ViewProviders;

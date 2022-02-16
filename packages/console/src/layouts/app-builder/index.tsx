import type { FunctionComponent, ReactElement } from "react";

import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import { Editor } from "@craftjs/core";

import { NavigationDrawer, AppBar } from "./navigation";
import { Card, Button, Text, Container } from "../../nodes";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "row",
}));

const Main = styled("main")(({ theme }) => ({
    marginTop: theme.spacing(8),
    width: "100%",
}));

const AppBuilderLayout: FunctionComponent = (): ReactElement => {
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Editor resolver={{ Card, Button, Text, Container }}>
            <Root>
                <AppBar open={open} />
                <NavigationDrawer
                    open={open}
                    onDrawerOpen={handleDrawerOpen}
                    onDrawerClose={handleDrawerClose}
                />
                <Main>
                    <Outlet />
                </Main>
            </Root>
        </Editor>
    );
};

export default AppBuilderLayout;

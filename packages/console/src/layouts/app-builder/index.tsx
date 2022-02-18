import { Editor } from "@craftjs/core";
import { styled } from "@mui/material/styles";
import type { FunctionComponent, ReactElement } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import {
    Button,
    Card,
    Container,
    Text,
    CardBottom,
    CardTop,
} from "../../nodes";

import { AppBar, NavigationDrawer } from "./navigation";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "row",
}));

const Main = styled("main")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
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
        <Editor
            resolver={{ Card, Button, Text, Container, CardBottom, CardTop }}>
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

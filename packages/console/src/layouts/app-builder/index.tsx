import type { FunctionComponent, ReactElement } from "react";

import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

import { MiniDrawer, AppBar } from "./navigation";

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
        <Root>
            <AppBar open={open} />
            <MiniDrawer
                open={open}
                onDrawerOpen={handleDrawerOpen}
                onDrawerClose={handleDrawerClose}
            />
            <Main>
                <Outlet />
            </Main>
        </Root>
    );
};

export default AppBuilderLayout;

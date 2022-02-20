import { styled } from "@mui/material/styles";
import type { FunctionComponent, ReactElement } from "react";
import { Outlet } from "react-router-dom";

import { AppBar } from "./navigation";

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

const VisitorLayout: FunctionComponent = (): ReactElement => {
    return (
        <Root>
            <AppBar open={false} />
            <Main>
                <Outlet />
            </Main>
        </Root>
    );
};

export default VisitorLayout;

import type { FunctionComponent, ReactElement } from "react";

import { Hidden } from "@mui/material";
import { styled } from "@mui/material/styles";

import MainToolbarDesktop from "./MainToolbarDesktop";
import MainToolbarMobile from "./MainToolbarMobile";

const Toolbar = styled("div")(({ theme }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
}));

const MainToolbar: FunctionComponent = (): ReactElement => {
    return (
        <Toolbar>
            <Hidden xlUp={true}>
                <MainToolbarMobile />
            </Hidden>
            <Hidden lgDown={true}>
                <MainToolbarDesktop />
            </Hidden>
        </Toolbar>
    );
};

export default MainToolbar;

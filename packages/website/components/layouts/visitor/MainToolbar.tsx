import type { FunctionComponent, ReactElement } from "react";

import { Hidden as MuiHidden } from "@mui/material";
import { styled } from "@mui/material/styles";

const Hidden = MuiHidden as any;

import MainToolbarDesktop from "./MainToolbarDesktop";
import MainToolbarMobile from "./MainToolbarMobile";

const Toolbar = styled("div")(({ theme }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
}));

export interface IMainToolbarProps {
    stargazers: number;
}

const MainToolbar: FunctionComponent<IMainToolbarProps> = (
    props: IMainToolbarProps,
): ReactElement => {
    const { stargazers } = props;
    return (
        <Toolbar>
            <Hidden xlUp={true}>
                <MainToolbarMobile />
            </Hidden>
            <Hidden lgDown={true}>
                <MainToolbarDesktop stargazers={stargazers} />
            </Hidden>
        </Toolbar>
    );
};

export default MainToolbar;

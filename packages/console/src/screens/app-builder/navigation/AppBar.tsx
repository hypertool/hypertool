import type { FunctionComponent, ReactElement } from "react";

import type { AppBarProps } from "@mui/material";
import { AppBar as MuiAppBar, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

import BuilderTabs from "./BuilderTabs";

interface IPrimaryAppBarProps extends AppBarProps {
    open?: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<IPrimaryAppBarProps>(({ theme, open }: any) => ({
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    background: (theme.palette.background as any).main,
    zIndex: theme.zIndex.drawer + 1,
    height: 48,
    width: `calc(100% - ${open ? 304 : 56}px)`,
    padding: `0px ${theme.spacing(2)}`,
    "& .MuiToolbar-root": {
        height: 48,
        minHeight: 48,
    },
}));

const StyledToolbar = styled(Toolbar)({});

interface IProps {
    open: boolean;
}

const AppBar: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { open } = props;
    return (
        <StyledAppBar open={open}>
            <StyledToolbar>
                <BuilderTabs />
            </StyledToolbar>
        </StyledAppBar>
    );
};

export default AppBar;

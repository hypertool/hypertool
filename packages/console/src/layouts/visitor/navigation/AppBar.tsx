import type { FunctionComponent, ReactElement } from "react";

import type { AppBarProps } from "@mui/material";
import { AppBar as MuiAppBar, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface PrimaryAppBarProps extends AppBarProps {
    open: boolean;
}

const DecoratedAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<PrimaryAppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),

    zIndex: theme.zIndex.drawer + 1,
}));

const Logo = styled("img")(({ theme }) => ({
    width: 32,
    height: "auto",
    marginRight: theme.spacing(1),
}));

const ToolName = styled(Typography)(({ theme }) => ({
    fontSize: 18,
    fontWeight: "bold",
}));

interface Props {
    open: boolean;
}

const AppBar: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { open } = props;
    return (
        <DecoratedAppBar open={open}>
            <Toolbar>
                <Logo src="https://res.cloudinary.com/hypertool/image/upload/v1642502111/hypertool-starter/hypertool-logo_xvqljy.png" />
                <ToolName variant="h6" sx={{ flexGrow: 1 }}>
                    Hypertool
                </ToolName>
            </Toolbar>
        </DecoratedAppBar>
    );
};

export default AppBar;

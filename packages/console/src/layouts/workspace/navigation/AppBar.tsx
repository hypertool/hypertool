import type { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useCallback, useState } from "react";

import type { AppBarProps } from "@mui/material";
import {
    IconButton,
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

import AccountCircle from "@mui/icons-material/AccountCircle";

interface PrimaryAppBarProps extends AppBarProps {
    open?: boolean;
}

const drawerWidth = 240;

const DecoratedAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<PrimaryAppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    flexDirection: "row",
    justifyContent: "space-between",

    [theme.breakpoints.up("lg")]: {
        zIndex: theme.zIndex.drawer + 1,

        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    },
}));

const Logo = styled("img")(({ theme }) => ({
    width: 32,
    height: "auto",
    marginRight: theme.spacing(1),
}));

const Options = styled(IconButton)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const Title = styled(Typography)(() => ({
    fontSize: 18,
    fontWeight: "bold",
}));
interface Props {
    open: boolean;
    onDrawerOpen: () => void;
}

const AppBar: FunctionComponent<Props> = (props: Props): ReactElement => {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            setAnchor(event.currentTarget);
        },
        [],
    );

    const handleMenuClose = useCallback(() => {
        setAnchor(null);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.clear();
        window.location.href = "/login";
    }, []);

    const renderMenu = (
        <Menu
            anchorEl={anchor}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            keepMounted={true}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(anchor)}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );

    return (
        <DecoratedAppBar>
            <Toolbar>
                <Logo src="https://res.cloudinary.com/hypertool/image/upload/v1642502111/hypertool-starter/hypertool-logo_xvqljy.png" />
                <Title variant="h6" sx={{ flexGrow: 1 }}>
                    Hypertool
                </Title>
            </Toolbar>
            <Options
                size="large"
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                <AccountCircle />
            </Options>
            {renderMenu}
        </DecoratedAppBar>
    );
};

export default AppBar;

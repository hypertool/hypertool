import type { FunctionComponent, ReactElement } from "react";
import { Fragment, useCallback } from "react";

import { Divider, IconButton, List, useMediaQuery } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useNavigate } from "react-router";

import MiniDrawerItem from "./MiniDrawerItem";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",

    width: "100%",

    [theme.breakpoints.up("lg")]: {
        width: drawerWidth,
    },
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",

    width: 0,

    [theme.breakpoints.up("lg")]: {
        width: 56,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),

    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",

    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),

    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const Logo = styled("img")(({ theme }) => ({
    width: 32,
    height: "auto",
    marginRight: theme.spacing(1),
}));

interface Props {
    open: boolean;
    onDrawerClose: () => void;
}

const groups = [
    {
        title: "General",
        items: [
            /*
             * {
             *     title: "Edit Profile",
             *     url: "/user/settings",
             *     icon: "account_circle",
             * },
             */
            /*
             * {
             *     title: "Organizations",
             *     url: "/organizations",
             *     icon: "business",
             * },
             */
            {
                title: "Applications",
                url: "/apps",
                icon: "apps",
            },
        ],
    },
    /*
     * {
     *     title: "Settings",
     *     items: [
     *         {
     *             title: "Billing",
     *             url: "/billing",
     *             icon: "sell",
     *         },
     *         {
     *             title: "Preferences",
     *             url: "/preferences",
     *             icon: "settings",
     *         },
     *     ],
     * },
     */
    {
        title: "Help",
        items: [
            {
                title: "Feedback",
                url: "/feedback",
                icon: "rate_review",
            },
            {
                title: "Documentation",
                url: "/documentation",
                icon: "help_outline",
            },
        ],
    },
];

const MiniDrawer: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { open, onDrawerClose } = props;
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("lg"));
    const navigate = useNavigate();

    const handleOpenURL = useCallback(
        (url: string) => {
            navigate(url);
        },
        [navigate],
    );

    return (
        <Drawer
            variant={matches ? "permanent" : undefined}
            open={matches ? true : false}
            anchor="left"
            onClose={onDrawerClose}
        >
            <DrawerHeader />
            <Divider />
            {groups.map((group, index: number) => (
                <Fragment key={group.title}>
                    <List>
                        {group.items.map((item) => (
                            <MiniDrawerItem
                                key={item.title}
                                open={open}
                                title={item.title}
                                url={item.url}
                                icon={item.icon}
                                onClick={handleOpenURL}
                            />
                        ))}
                    </List>
                    {index + 1 < groups.length && <Divider />}
                </Fragment>
            ))}
        </Drawer>
    );
};

export default MiniDrawer;

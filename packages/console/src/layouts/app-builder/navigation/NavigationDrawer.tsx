import type { FunctionComponent, ReactElement } from "react";

import { useState, Fragment, useCallback } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { List, Divider } from "@mui/material";
import { useNavigate } from "react-router";

import NavigationDrawerItem from "./NavigationDrawerItem";
import Explorer from "./Explorer";
import Components from "./Components";
import Resources from "./Resources";
import Teams from "./Teams";
import Deployment from "./Deployment";

const drawerWidth = 304;
const navigationWidth = 56;
const panelWidth = drawerWidth - navigationWidth;

const openedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    width: drawerWidth,
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: 56,
});

const Root = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    height: "100vh",

    /* Necessary for content to be below app bar */
    ...theme.mixins.toolbar,
}));

const Navigation = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: navigationWidth,

    /* Necessary for content to be below app bar */
    ...theme.mixins.toolbar,
}));

const NavigationContainer = styled("div")(({ theme }) => ({
    backgroundColor: "#212121",
    width: panelWidth,
}));

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

interface Props {
    open: boolean;
    onDrawerClose: () => void;
    onDrawerOpen: () => void;
}

interface Item {
    title: string;
    id: string;
    url?: string;
    icon: string;
}

interface Group {
    title: string;
    items: Item[];
}

const groups: Group[] = [
    {
        title: "General",
        items: [
            {
                title: "Explorer",
                id: "explorer",
                icon: "layers",
            },
            {
                title: "Components",
                id: "components",
                icon: "bubble_chart",
            },
            {
                title: "Resources",
                id: "resources",
                icon: "category",
            },
        ],
    },
    {
        title: "Administrator",
        items: [
            {
                title: "Teams",
                id: "teams",
                icon: "people",
            },
            {
                title: "Deployment",
                id: "deployment",
                icon: "cloud",
            },
        ],
    },
    {
        title: "Help",
        items: [
            {
                title: "Feedback",
                id: "feedback",
                url: "/feedback",
                icon: "rate_review",
            },
            {
                title: "Documentation",
                id: "documentation",
                url: "https://docs.hypertool.io",
                icon: "help_outline",
            },
        ],
    },
];

const NavigationDrawer: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { open, onDrawerOpen, onDrawerClose } = props;
    const [active, setActive] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleOpenItem = useCallback(
        (id: string, url?: string) => {
            if (url) {
                if (url.startsWith("https://")) {
                    window.open(url);
                } else {
                    navigate(url);
                }
            } else {
                if (id === active) {
                    setActive(null);
                    onDrawerClose();
                } else {
                    setActive(id);
                    onDrawerOpen();
                }
            }
        },
        [active, navigate, onDrawerClose, onDrawerOpen],
    );

    return (
        <Drawer
            variant={"permanent"}
            open={open}
            anchor="left"
            onClose={onDrawerClose}
        >
            <DrawerHeader></DrawerHeader>
            <Divider />
            <Root>
                <Navigation>
                    {groups.map((group, index: number) => (
                        <Fragment key={group.title}>
                            <List>
                                {group.items.map((item) => (
                                    <NavigationDrawerItem
                                        open={open}
                                        title={item.title}
                                        id={item.id}
                                        url={item.url}
                                        icon={item.icon}
                                        onClick={handleOpenItem}
                                        selected={active === item.id}
                                    />
                                ))}
                            </List>
                            {index + 1 < groups.length && <Divider />}
                        </Fragment>
                    ))}
                </Navigation>
                {active && (
                    <NavigationContainer>
                        {active === "explorer" && <Explorer />}
                        {active === "components" && <Components />}
                        {active === "resources" && <Resources />}
                        {active === "teams" && <Teams />}
                        {active === "deployment" && <Deployment />}
                    </NavigationContainer>
                )}
            </Root>
        </Drawer>
    );
};

export default NavigationDrawer;

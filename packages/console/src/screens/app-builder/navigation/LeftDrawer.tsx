import type { FunctionComponent, ReactElement } from "react";
import { Fragment, useCallback, useState } from "react";

import { Divider, List, Drawer as MuiDrawer } from "@mui/material";
import { CSSObject, Theme, styled } from "@mui/material/styles";

import { useNavigate } from "react-router";

import { Explorer } from "../panels/explorer";

import Components from "./Components";
import Deployment from "./Deployment";
import LeftDrawerItem from "./LeftDrawerItem";
import Teams from "./Teams";

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
    background: (theme.palette.background as any).main,

    /* Necessary for content to be below app bar */
    ...theme.mixins.toolbar,
}));

const StyledList = styled(List)({ padding: 0 });

const Navigation = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: navigationWidth,

    /* Necessary for content to be below app bar */
    ...theme.mixins.toolbar,
}));

const NavigationContainer = styled("div")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).paper2,
    width: panelWidth,
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

const LeftDrawer: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { open, onDrawerOpen, onDrawerClose } = props;
    const [active, setActive] = useState<string>("explorer");
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
                if (id === active && open) {
                    onDrawerClose();
                } else {
                    setActive(id);
                    onDrawerOpen();
                }
            }
        },
        [active, navigate, onDrawerClose, onDrawerOpen, open],
    );

    return (
        <Drawer
            variant="permanent"
            open={open}
            anchor="left"
            onClose={onDrawerClose}
        >
            <Root>
                <Navigation>
                    {groups.map((group, index: number) => (
                        <Fragment key={group.title}>
                            <StyledList>
                                {group.items.map((item) => (
                                    <LeftDrawerItem
                                        key={item.id}
                                        open={open}
                                        title={item.title}
                                        id={item.id}
                                        url={item.url}
                                        icon={item.icon}
                                        onClick={handleOpenItem}
                                        selected={active === item.id}
                                    />
                                ))}
                            </StyledList>
                            {index + 1 < groups.length && <Divider />}
                        </Fragment>
                    ))}
                </Navigation>
                {active && (
                    <NavigationContainer>
                        {active === "explorer" && <Explorer />}
                        {active === "components" && <Components />}
                        {active === "teams" && <Teams />}
                        {active === "deployment" && <Deployment />}
                    </NavigationContainer>
                )}
            </Root>
        </Drawer>
    );
};

export default LeftDrawer;

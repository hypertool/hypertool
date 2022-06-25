import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import { Drawer as MuiDrawer, Tab, Tabs } from "@mui/material";
import { CSSObject, Theme, styled } from "@mui/material/styles";

import { useEditor } from "../../../craft";
import { PropertiesEditor } from "../panels/properties-editor";
import { ScreenEditor } from "../modules/builder/screen-editor";

const drawerWidth = 304;

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
    width: 0,
});

const Root = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    background: (theme.palette.background as any).main,
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    marginTop: 48,
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
    activeTabBundle: any;
}

type TabIdentifier = "properties" | "comments" | "screen";

const RightDrawer: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { open, onDrawerClose, activeTabBundle } = props;
    const [active, setActive] = useState<TabIdentifier>("properties");
    const selected = useEditor((state) => state.events.selected);

    const handleChange = useCallback((event, newValue) => {
        setActive(newValue);
    }, []);

    return (
        <Drawer
            variant="permanent"
            open={open}
            anchor="right"
            onClose={onDrawerClose}
        >
            <DrawerHeader />
            <Root>
                <div style={{ width: "100%" }}>
                    <Tabs
                        value={active}
                        onChange={handleChange}
                        variant="fullWidth"
                    >
                        <Tab value="properties" label="Properties" />
                        {/* <Tab value="comments" label="Comments" /> */}

                        <Tab value="screen" label="Screen" />
                    </Tabs>
                    {active === "properties" && selected && (
                        <PropertiesEditor />
                    )}
                    {active === "screen" && (
                        <ScreenEditor screenId={activeTabBundle.screenId} />
                    )}
                </div>
            </Root>
        </Drawer>
    );
};

export default RightDrawer;

import type { FunctionComponent, ReactElement } from "react";

import { useState, useCallback } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
    Divider,
    Drawer as MuiDrawer,
    Tabs,
    Tab,
    Box,
    Typography,
} from "@mui/material";

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

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={tabIndices[value] !== index}
            id={value}
            {...other}>
            {tabIndices[value] === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: TabIdentifier;
}
interface Props {
    open: boolean;
    onDrawerClose: () => void;
}

const tabIndices = {
    properties: 0,
    comments: 1,
};

type TabIdentifier = "properties" | "comments";

const EditorDrawer: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { open, onDrawerClose } = props;
    const [active, setActive] = useState<TabIdentifier>("properties");

    const handleChange = useCallback((event, newValue) => {
        setActive(newValue);
    }, []);

    return (
        <Drawer
            variant="permanent"
            open={open}
            anchor="right"
            onClose={onDrawerClose}>
            <DrawerHeader></DrawerHeader>
            <Divider />
            <Root>
                <div>
                    <Tabs
                        value={active}
                        onChange={handleChange}
                        variant="fullWidth">
                        <Tab value="properties" label="Properties" />
                        <Tab value="comments" label="Comments" />
                    </Tabs>
                    <TabPanel value={active} index={0}>
                        Hello
                    </TabPanel>
                </div>
            </Root>
        </Drawer>
    );
};

export default EditorDrawer;

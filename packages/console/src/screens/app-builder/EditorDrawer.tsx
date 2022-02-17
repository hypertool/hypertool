import {
    Box,
    Chip,
    Divider,
    FormControl,
    FormLabel,
    Grid,
    Button as MaterialButton,
    Drawer as MuiDrawer,
    Slider,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { CSSObject, Theme, styled } from "@mui/material/styles";
import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

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
    background: (theme.palette.background as any).paper1,
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
}

type TabIdentifier = "properties" | "comments";

const PropertiesEditor = () => {
    return (
        <Box mt={2} px={2} py={2}>
            <Grid container direction="column" spacing={0}>
                <Grid item>
                    <Box pb={2}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography variant="subtitle1">
                                    Selected
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Chip
                                    size="small"
                                    color="primary"
                                    label="Selected"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <FormControl size="small" component="fieldset">
                    <FormLabel component="legend">Prop</FormLabel>
                    <Slider
                        defaultValue={0}
                        step={1}
                        min={7}
                        max={50}
                        valueLabelDisplay="auto"
                    />
                </FormControl>
                <MaterialButton variant="contained" color="primary">
                    Delete
                </MaterialButton>
            </Grid>
        </Box>
    );
};

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
            onClose={onDrawerClose}
        >
            <DrawerHeader></DrawerHeader>
            <Divider />
            <Root>
                <div>
                    <Tabs
                        value={active}
                        onChange={handleChange}
                        variant="fullWidth"
                    >
                        <Tab value="properties" label="Properties" />
                        <Tab value="comments" label="Comments" />
                    </Tabs>
                    {active === "properties" && <PropertiesEditor />}
                </div>
            </Root>
        </Drawer>
    );
};

export default EditorDrawer;

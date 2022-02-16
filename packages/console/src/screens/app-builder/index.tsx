import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from "react";
import { Editor, Frame } from "@craftjs/core";

import CodeEditor from "./CodeEditor";
import EditorDrawer from "./editor";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(0),
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    textTransform: "none",
    width: "100%",
    [theme.breakpoints.up("md")]: {
        width: 120,
    },
}));

const AppBuilder: FunctionComponent = (): ReactElement => {
    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleClick = useCallback(() => {
        setDrawerOpen(!drawerOpen);
    }, [drawerOpen]);

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
    }, []);

    useEffect(() => {
        if (drawerOpen) {
            document.title = "App Builder | Hypertool";
        } else {
            document.title = "Edit Source | Hypertool";
        }
    }, [drawerOpen]);

    return (
        <>
            <Root>
                <PrimaryAction onClick={handleClick}>Code Editor</PrimaryAction>
                {drawerOpen && <CodeEditor />}
            </Root>
            <EditorDrawer open={drawerOpen} onDrawerClose={handleDrawerClose} />
        </>
    );
};

export default AppBuilder;

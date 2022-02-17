import { Element, Frame } from "@craftjs/core";
import { Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from "react";

import { Button, Card, Container, Text } from "../../nodes";

import CodeEditor from "./CodeEditor";
import EditorDrawer from "./EditorDrawer";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(0),
}));

const PrimaryAction = styled(MuiButton)(({ theme }) => ({
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
        <Root>
            <PrimaryAction onClick={handleClick}>Code Editor</PrimaryAction>
            {!drawerOpen && <CodeEditor />}
            <EditorDrawer open={drawerOpen} onDrawerClose={handleDrawerClose} />
            <Frame>
                <Element is={Container} padding={5} background="#eee" canvas>
                    <Card />
                    <Button size="small" variant="outlined">
                        Click
                    </Button>
                    <Text size="small" text="Hi world!" />
                    <Container padding={6} background="#999">
                        <Text size="small" text="It's me again!" />
                    </Container>
                </Element>
            </Frame>
            <EditorDrawer open={true} onDrawerClose={() => null} />
        </Root>
    );
};

export default AppBuilder;

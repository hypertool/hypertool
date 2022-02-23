import { Element, Frame } from "@craftjs/core";
import { styled } from "@mui/material/styles";
import {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from "react";

import { useQueryParams } from "../../hooks";
import { Button, Card, Container, Text } from "../../nodes";

import CodeEditor from "./CodeEditor";
import EditorDrawer from "./EditorDrawer";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(0),
}));

type modes = "design" | "code";

const AppBuilder: FunctionComponent = (): ReactElement => {
    const [drawerOpen, setDrawerOpen] = useState(true);

    const [mode, setMode] = useState<modes>("design");
    const params = useQueryParams();

    useEffect(() => {
        if ((params as any).mode && (params as any).mode !== mode) {
            setMode((params as any).mode);
        }
    }, [params, mode]);

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
            {mode === "code" && <CodeEditor />}
            <EditorDrawer open={drawerOpen} onDrawerClose={handleDrawerClose} />
            <Frame>
                <Element
                    is={Container}
                    padding={5}
                    background="#333"
                    canvas={true}
                >
                    <Card />
                    <Text size="small" text="Hi world!" />
                    <Container padding={6} background="#999">
                        <Text size="small" text="It's me again!" />
                    </Container>
                </Element>
            </Frame>
        </Root>
    );
};

export default AppBuilder;

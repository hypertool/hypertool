import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import { styled } from "@mui/material/styles";

import { Editor, Element, Frame } from "@craftjs/core";

import { ArtifactsContext } from "../../contexts";
import { useInflateArtifacts, useQueryParams } from "../../hooks";
import { Button, Container, Text, nodeMappings } from "../../nodes";
import { templates } from "../../utils";

import CanvasViewport from "./CanvasViewport";
import CodeEditor from "./CodeEditor";
import { RenderNode } from "./RenderNode";
import { AppBar, LeftDrawer, RightDrawer } from "./navigation";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "row",
}));

const Main = styled("main")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
    marginTop: theme.spacing(8),
    width: "100%",
}));

const Content = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(0),
}));

type Modes = "design" | "code";

const AppBuilder: FunctionComponent = (): ReactElement => {
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
    const [mode, setMode] = useState<Modes>("design");
    const params = useQueryParams();
    const [editorValue, setEditorValue] = useState<string | undefined>(
        templates.CONTROLLER_TEMPLATE,
    );

    useEffect(() => {
        if ((params as any).mode && (params as any).mode !== mode) {
            setMode((params as any).mode);
        }
    }, [params, mode]);

    useEffect(() => {
        document.title = "App Builder | Hypertool";
    }, []);

    const artifacts = useInflateArtifacts([
        { id: "anonymous", code: editorValue ?? "" },
    ]);

    const handleLeftDrawerOpen = () => {
        setLeftDrawerOpen(true);
    };

    const handleLeftDrawerClose = () => {
        setLeftDrawerOpen(false);
    };

    const handleRightDrawerClose = useCallback(() => {
        setRightDrawerOpen(false);
    }, []);

    return (
        <Editor resolver={nodeMappings} onRender={RenderNode}>
            <Root>
                <ArtifactsContext.Provider value={artifacts}>
                    <AppBar open={leftDrawerOpen} />
                    <LeftDrawer
                        open={leftDrawerOpen}
                        onDrawerOpen={handleLeftDrawerOpen}
                        onDrawerClose={handleLeftDrawerClose}
                    />
                    <Main>
                        <Content>
                            {mode === "code" && (
                                <CodeEditor
                                    value={editorValue}
                                    onChange={setEditorValue}
                                />
                            )}
                            <CanvasViewport>
                                <Frame>
                                    <Element
                                        is={Container}
                                        padding={4}
                                        canvas={true}>
                                        <Element
                                            canvas
                                            is={Container}
                                            padding={6}
                                            background="#999999">
                                            <Text
                                                fontSize="small"
                                                text="It's me again!"
                                            />
                                        </Element>
                                        <Button />
                                    </Element>
                                </Frame>
                            </CanvasViewport>
                        </Content>
                    </Main>
                    <RightDrawer
                        open={rightDrawerOpen}
                        onDrawerClose={handleRightDrawerClose}
                    />
                </ArtifactsContext.Provider>
            </Root>
        </Editor>
    );
};

export default AppBuilder;

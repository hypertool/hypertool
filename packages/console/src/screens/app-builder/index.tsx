import { FunctionComponent, ReactElement, useEffect, useState } from "react";

import { styled } from "@mui/material/styles";

import { Element, Frame } from "@craftjs/core";

import { useQueryParams } from "../../hooks";
import { Button, Card, Container, Text } from "../../nodes";

import CanvasViewport from "./CanvasViewport";
import CodeEditor from "./CodeEditor";

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
    const [mode, setMode] = useState<modes>("design");
    const params = useQueryParams();

    useEffect(() => {
        if ((params as any).mode && (params as any).mode !== mode) {
            setMode((params as any).mode);
        }
    }, [params, mode]);

    useEffect(() => {
        document.title = "App Builder | Hypertool";
    }, []);

    return (
        <Root>
            {mode === "code" && <CodeEditor />}
            <CanvasViewport>
                <Frame>
                    <Element is={Container} padding={4} canvas={true}>
                        <Card />
                        <Button text="Click me" size="small" />
                        <Text fontSize={20} text="Hi world!" />
                        <Element
                            canvas
                            is={Container}
                            padding={6}
                            background="#999999"
                        >
                            <Text fontSize="small" text="It's me again!" />
                        </Element>
                    </Element>
                </Frame>
            </CanvasViewport>
        </Root>
    );
};

export default AppBuilder;

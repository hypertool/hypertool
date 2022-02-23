import { FunctionComponent, ReactElement, useEffect, useState } from "react";

import { styled } from "@mui/material/styles";

import { Element, Frame } from "@craftjs/core";

import { useQueryParams } from "../../hooks";
import { Card, Container, Text } from "../../nodes";

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
            <Frame>
                <Element
                    is={Container}
                    padding={5}
                    background="#333"
                    canvas={true}
                >
                    <Card />
                    <Container padding={6} background="#999">
                        <Text text="It's me again!" />
                    </Container>
                </Element>
            </Frame>
        </Root>
    );
};

export default AppBuilder;

import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useMemo } from "react";

import { styled } from "@mui/material/styles";

import { Element, Frame } from "@craftjs/core";

import { useQueryParams } from "../../hooks";
import { Button, Container, Text } from "../../nodes";
import { templates } from "../../utils";

import CanvasViewport from "./CanvasViewport";
import CodeEditor from "./CodeEditor";
import EvaluationContext from "./EvaluationContext";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(0),
}));

type Modes = "design" | "code";

const AppBuilder: FunctionComponent = (): ReactElement => {
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

    const evaluations = useMemo(() => {
        let evaluation: any = {};
        try {
            // eslint-disable-next-line no-eval
            evaluation = eval(editorValue ?? "");
            console.log("Eval", evaluation);
        } catch (error) {
            console.log("Error", error);
        }
        return {
            anonymous: evaluation,
        };
    }, [editorValue]);

    return (
        <Root>
            {mode === "code" && (
                <CodeEditor value={editorValue} onChange={setEditorValue} />
            )}
            <EvaluationContext.Provider value={evaluations}>
                <CanvasViewport>
                    <Frame>
                        <Element is={Container} padding={4} canvas={true}>
                            <Element
                                canvas
                                is={Container}
                                padding={6}
                                background="#999999">
                                <Text fontSize="small" text="It's me again!" />
                            </Element>
                            <Button />
                        </Element>
                    </Frame>
                </CanvasViewport>
            </EvaluationContext.Provider>
        </Root>
    );
};

export default AppBuilder;

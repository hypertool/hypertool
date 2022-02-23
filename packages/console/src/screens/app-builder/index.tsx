import { FunctionComponent, ReactElement, useEffect, useState } from "react";

import { styled } from "@mui/material/styles";

import { useQueryParams } from "../../hooks";

import Canvas from "./Canvas";
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
            {mode === "design" && <Canvas />}
        </Root>
    );
};

export default AppBuilder;

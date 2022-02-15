import Editor from "@monaco-editor/react";
import { styled } from "@mui/material/styles";
import { FunctionComponent, ReactElement, useCallback, useState } from "react";

import { templates } from "../../utils";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0),
}));

const CodeEditor: FunctionComponent = (): ReactElement => {
    const [editorValue, setEditorValue] = useState<string | undefined>(
        templates.CONTROLLER_TEMPLATE,
    );

    const handleChange = useCallback((value?: string) => {
        setEditorValue(value);
    }, []);

    return (
        <Root>
            <Editor
                height="100vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue={templates.CONTROLLER_TEMPLATE}
                value={editorValue}
                onChange={handleChange}
            />
        </Root>
    );
};

export default CodeEditor;

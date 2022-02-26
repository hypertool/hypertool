import { FunctionComponent, ReactElement, useCallback, useState } from "react";

import { styled } from "@mui/material/styles";

import Editor from "@monaco-editor/react";

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

export interface Props {
    value?: string;
    onChange: (value?: string) => void;
}

const CodeEditor: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { value, onChange } = props;

    const handleChange = useCallback(
        (value?: string) => {
            onChange(value);
        },
        [onChange],
    );

    return (
        <Root>
            <Editor
                height="100vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue={templates.CONTROLLER_TEMPLATE}
                value={value}
                onChange={handleChange}
            />
        </Root>
    );
};

export default CodeEditor;

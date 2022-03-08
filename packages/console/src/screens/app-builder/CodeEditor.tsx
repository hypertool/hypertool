import { FunctionComponent, ReactElement } from "react";

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

export interface IProps {
    onChange: (value?: string) => void;
    path: string;
}

const CodeEditor: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { path, onChange } = props;

    return (
        <Root>
            <Editor
                height="100vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue={templates.CONTROLLER_TEMPLATE}
                onChange={onChange}
                path={path}
                saveViewState={true}
            />
        </Root>
    );
};

export default CodeEditor;

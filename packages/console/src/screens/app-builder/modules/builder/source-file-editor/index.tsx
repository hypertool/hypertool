import { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { useEffect } from "react";

import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import Editor from "@monaco-editor/react";

import {
    useBuilderActions,
    useNotification,
    useSourceFile,
    useTab,
    useTabBundle,
    useUpdateTabTitle,
} from "../../../../../hooks";
import { IEditSourceFileBundle } from "../../../../../types";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: theme.spacing(0),
}));

const Right = styled("div")(({ theme }) => ({
    width: 264,
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
}));

const SourceFileEditor: FunctionComponent = (): ReactElement => {
    const { tab } = useTab();
    const path = tab.id;

    const notification = useNotification();
    const actions = useBuilderActions();
    const [editorRef, setEditorRef] = useState<
        monaco.editor.IStandaloneCodeEditor | undefined
    >();
    const { sourceFileId } = useTabBundle<IEditSourceFileBundle>();
    const { name, content, id } = useSourceFile(sourceFileId);

    useUpdateTabTitle(name);

    useEffect(() => {
        editorRef?.setValue(content);
    }, [content, editorRef]);

    const handleSave = useCallback(async () => {
        if (!editorRef) {
            return;
        }

        try {
            await actions.updateSourceFile({
                id,
                content: editorRef.getValue(),
            });
        } catch (error: any) {
            notification.notifyError(error);
        }
    }, [actions, editorRef, id, notification]);

    const handleEditorMount = useCallback(
        (editor: monaco.editor.IStandaloneCodeEditor) => {
            setEditorRef(editor);
        },
        [],
    );

    return (
        <Root>
            <Editor
                height="100vh"
                width="calc(100% - 264px)"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue={""}
                path={path}
                saveViewState={true}
                onMount={handleEditorMount}
            />
            <Right>
                <Button
                    variant="contained"
                    fullWidth={true}
                    onClick={handleSave}
                    size="small"
                >
                    Save
                </Button>
            </Right>
        </Root>
    );
};

export default SourceFileEditor;

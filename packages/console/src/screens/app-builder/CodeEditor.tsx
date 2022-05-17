import { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { useEffect } from "react";

import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import Editor from "@monaco-editor/react";

import {
    useNotification,
    useTab,
    useTabBundle,
    useUpdateTabTitle,
} from "../../hooks";
import { IEditControllerBundle } from "../../types";

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

const GET_CONTROLLER = gql`
    query GetController($controllerId: ID!) {
        getControllerById(controllerId: $controllerId) {
            id
            name
            language
            patched
        }
    }
`;

const UPDATE_CONTROLLER = gql`
    mutation UpdateControllerWithSource($controllerId: ID!, $source: String!) {
        updateControllerWithSource(
            controllerId: $controllerId
            source: $source
        ) {
            id
        }
    }
`;

const CodeEditor: FunctionComponent = (): ReactElement => {
    const { tab } = useTab();
    const path = tab.id;

    const notification = useNotification();
    const [editorRef, setEditorRef] = useState<
        monaco.editor.IStandaloneCodeEditor | undefined
    >();
    const { controllerId } = useTabBundle<IEditControllerBundle>();
    // TODO: Destructure `error`, check for non-null, send to sentry
    const { data } = useQuery(GET_CONTROLLER, {
        variables: {
            controllerId,
        },
        notifyOnNetworkStatusChange: true,
    });
    const { name = "", patched = "" } = data?.getControllerById ?? {};

    const [updateController] = useMutation(UPDATE_CONTROLLER, {
        refetchQueries: ["GetController"],
    });

    useUpdateTabTitle(name);

    useEffect(() => {
        editorRef?.setValue(patched);
    }, [patched, editorRef]);

    const handleSave = useCallback(async () => {
        if (!editorRef) {
            return;
        }

        try {
            await updateController({
                variables: {
                    controllerId,
                    source: editorRef.getValue(),
                },
            });
        } catch (error: any) {
            notification.notifyError(error);
        }
    }, [editorRef]);

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

export default CodeEditor;

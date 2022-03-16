import { FunctionComponent, ReactElement, useCallback, useRef } from "react";
import { useEffect } from "react";

import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import Editor from "@monaco-editor/react";

import { useTabBundle, useTabContext, useUpdateTabTitle } from "../../hooks";
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

export interface IProps {
    onChange: (value?: string) => void;
    path: string;
}

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

const controllersById: Record<string, string> = {};

const CodeEditor: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { path, onChange } = props;

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
    const { tab } = useTabContext();
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
        controllersById[tab.id] = patched;
        if (editorRef.current?.getValue() === "") {
            editorRef.current?.setValue(patched);
        }
    }, [patched, editorRef.current]);

    const handleSave = useCallback(() => {
        if (!editorRef.current) {
            return;
        }

        const newController = editorRef.current.getValue();
        const oldController = controllersById[tab.id];
        if (newController === oldController) {
            return;
        }

        updateController({
            variables: {
                controllerId,
                source: newController,
            },
        });
    }, []);

    const handleEditorMount = useCallback(
        (editor: monaco.editor.IStandaloneCodeEditor) => {
            editorRef.current = editor;
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
                onChange={onChange}
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

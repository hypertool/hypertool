import { FunctionComponent, ReactElement, useCallback, useRef } from "react";
import { useEffect } from "react";

import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import Editor from "@monaco-editor/react";

import {
    useInterval,
    useTabBundle,
    useTabContext,
    useUpdateTabTitle,
} from "../../hooks";
import { IEditControllerBundle } from "../../types";

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
        editorRef.current?.setValue(patched);
    }, [patched, editorRef.current]);

    useInterval(() => {
        if (!editorRef.current) {
            return;
        }

        const newController = editorRef.current.getValue();
        const oldController = controllersById[tab.id];
        if (newController === oldController) {
            return;
        }

        controllersById[tab.id] = newController;
        updateController({
            variables: {
                controllerId,
                source: newController,
            },
        });
    }, 3000);

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
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue={""}
                onChange={onChange}
                path={path}
                saveViewState={true}
                onMount={handleEditorMount}
            />
        </Root>
    );
};

export default CodeEditor;

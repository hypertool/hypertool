import type { FunctionComponent, ReactElement } from "react";
import { useContext, useEffect } from "react";

import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import Editor from "@monaco-editor/react";

import { BuilderActionsContext, TabContext } from "../../contexts";
import { IEditControllerBundle } from "../../types";
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

const GET_CONTROLLER = gql`
    query GetController($controllerId: ID!) {
        getControllerById(controllerId: $controllerId) {
            id
            name
            language
            patches {
                content
            }
        }
    }
`;

const CodeEditor: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { path, onChange } = props;
    const { setTabTitle } = useContext(BuilderActionsContext);
    const { index, tab } = useContext(TabContext) || {
        index: -1,
        bundle: {},
    };
    const error = () => {
        throw new Error("Controller ID is missing in tab bundle.");
    };
    // TODO: Destructure `error`, check for non-null, send to sentry
    const { data } = useQuery(GET_CONTROLLER, {
        variables: {
            controllerId:
                (tab?.bundle as IEditControllerBundle)?.controllerId || error(),
        },
        notifyOnNetworkStatusChange: true,
    });
    const { name = "" } = data?.getControllerById ?? {};

    useEffect(() => {
        if (!name || index < 0) {
            return;
        }
        setTabTitle(index, name);
    }, [index, name, setTabTitle]);

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

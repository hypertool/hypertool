import { FunctionComponent, ReactElement, useEffect, useRef } from "react";

import { gql, useMutation, useQuery } from "@apollo/client";

import { Element, Frame, useEditor } from "../../craft";
import {
    useInterval,
    useNotification,
    useTabBundle,
    useUpdateTabTitle,
} from "../../hooks";
import { ButtonNode, ContainerNode, FragmentNode } from "../../nodes";
import { IEditScreenBundle } from "../../types";

import CanvasViewport from "./CanvasViewport";

const GET_SCREEN = gql`
    query GetScreen($screenId: ID!) {
        getScreenById(screenId: $screenId) {
            id
            name
            content
        }
    }
`;

const UPDATE_SCREEN = gql`
    mutation UpdateScreen($screenId: ID!, $content: String!) {
        updateScreen(screenId: $screenId, content: $content) {
            id
        }
    }
`;

const CanvasEditor: FunctionComponent = (): ReactElement => {
    const bundle = useTabBundle<IEditScreenBundle>();
    const { actions, query } = useEditor();
    // TODO: Destructure `error`, check for non-null, send to sentry
    const { data } = useQuery(GET_SCREEN, {
        variables: {
            screenId: bundle.screenId,
        },
        notifyOnNetworkStatusChange: true,
    });
    useUpdateTabTitle(data?.getScreenById?.name);
    const notification = useNotification();

    const [updateScreen] = useMutation(UPDATE_SCREEN);

    const previousContent = useRef("");

    useInterval(async () => {
        const content = query.serialize();
        if (content === previousContent.current) {
            return;
        }

        try {
            await updateScreen({
                variables: {
                    screenId: bundle.screenId,
                    content,
                },
            });
        } catch (error: any) {
            notification.notifyError(error);
        }

        previousContent.current = content;
    }, 5000);

    useEffect(() => {
        if (data?.getScreenById) {
            const { content } = data.getScreenById;
            if (content) {
                actions.deserialize(content);
            }
        }
    }, [data?.getScreenById?.content]);

    return (
        <CanvasViewport>
            <Frame>
                <Element is={ContainerNode} canvas={true}>
                    <Element is={FragmentNode} canvas={true}>
                        <ButtonNode />
                    </Element>
                </Element>
            </Frame>
        </CanvasViewport>
    );
};

export default CanvasEditor;

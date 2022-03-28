import { FunctionComponent, ReactElement, useEffect, useRef } from "react";

import { gql, useMutation, useQuery } from "@apollo/client";

import { useParams } from "react-router-dom";

import { Element, Frame, useEditor } from "../../craft";
import { useInterval, useTabBundle, useUpdateTabTitle } from "../../hooks";
import { Button, Container } from "../../nodes";
import { IEditScreenBundle } from "../../types";

import CanvasViewport from "./CanvasViewport";

const GET_SCREEN = gql`
    query GetScreen($appId: ID!, $screenId: ID!) {
        getScreenById(appId: $appId, screenId: $screenId) {
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
    const { appId } = useParams();
    // TODO: Destructure `error`, check for non-null, send to sentry
    const { data } = useQuery(GET_SCREEN, {
        variables: {
            appId,
            screenId: bundle.screenId,
        },
        notifyOnNetworkStatusChange: true,
    });
    useUpdateTabTitle(data?.getScreenById?.name);

    const [
        updateScreen,
        /*
         * {
         *     loading: updatingScreen,
         *     data: updatedScreen,
         *     error: updateScreenError,
         * },
         */
    ] = useMutation(UPDATE_SCREEN);

    const previousContent = useRef("");

    useInterval(() => {
        const content = query.serialize();
        if (content === previousContent.current) {
            return;
        }

        updateScreen({
            variables: {
                screenId: bundle.screenId,
                content,
            },
        });

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
                <Element is={Container} padding={4} canvas={true}>
                    <Button />
                </Element>
            </Frame>
        </CanvasViewport>
    );
};

export default CanvasEditor;

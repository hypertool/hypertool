import type { FunctionComponent, ReactElement } from "react";
import { useEffect } from "react";

import { gql, useQuery } from "@apollo/client";

import { Element, Frame, useEditor } from "../../craft";
import { useTab, useTabBundle, useUpdateTabTitle } from "../../hooks";
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

const CanvasEditor: FunctionComponent = (): ReactElement => {
    const bundle = useTabBundle<IEditScreenBundle>();
    const { tab } = useTab();
    const { actions } = useEditor();
    const { data } = useQuery(GET_SCREEN, {
        variables: {
            screenId: bundle.screenId,
        },
        notifyOnNetworkStatusChange: true,
    });
    useUpdateTabTitle(data?.getScreenById?.name);

    useEffect(() => {
        if (data?.getScreenById) {
            const { content } = data.getScreenById;
            if (content) {
                actions.deserialize(content);
                const oldObject = JSON.parse(
                    localStorage.getItem("nodes") || "{}",
                );
                localStorage.setItem(
                    "nodes",
                    JSON.stringify(
                        {
                            [bundle.screenId]: content,
                            ...oldObject,
                        },
                        null,
                        4,
                    ),
                );
            }
        }
    }, [data?.getScreenById?.content, actions, bundle, bundle.screenId]);

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

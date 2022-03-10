import { FunctionComponent, ReactElement } from "react";

import { gql, useQuery } from "@apollo/client";

import { Element, Frame } from "../../craft";
import { useTabBundle, useUpdateTabTitle } from "../../hooks";
import { Button, Container } from "../../nodes";
import { IEditScreenBundle } from "../../types";

import CanvasViewport from "./CanvasViewport";

const GET_SCREEN = gql`
    query GetScreen($appId: ID!, $screenId: ID!) {
        getScreenById(appId: $appId, screenId: $screenId) {
            id
            name
        }
    }
`;

const CanvasEditor: FunctionComponent = (): ReactElement => {
    const bundle = useTabBundle<IEditScreenBundle>();
    // TODO: Destructure `error`, check for non-null, send to sentry
    const { data } = useQuery(GET_SCREEN, {
        variables: {
            appId: "61c93a931da4a79d3a109947",
            screenId: bundle.screenId,
        },
        notifyOnNetworkStatusChange: true,
    });
    useUpdateTabTitle(data?.getScreenById?.name);

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

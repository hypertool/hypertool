import type { FunctionComponent, ReactElement } from "react";

import { Element, Frame } from "@craftjs/core";

import { Button, Container } from "../../nodes";

import CanvasViewport from "./CanvasViewport";

const CanvasEditor: FunctionComponent = (): ReactElement => {
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

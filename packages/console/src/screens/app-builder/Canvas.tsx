import { Element, Frame } from "@craftjs/core";

import { Card, Container, Text } from "../../nodes";

import CanvasHeader from "./CanvasHeader";

const Canvas = () => (
    <>
        <CanvasHeader />
        <Frame>
            <Element is={Container} padding={5} background="#333" canvas={true}>
                <Card />
                <Container padding={6} background="#999">
                    <Text text="It's me again!" />
                </Container>
            </Element>
        </Frame>
    </>
);

export default Canvas;

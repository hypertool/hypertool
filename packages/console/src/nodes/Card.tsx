import { Element, useNode } from "@craftjs/core";

import { Button } from "./Button";
import { Container } from "./Container";
import { Text } from "./Text";

export const CardTop = ({ children }: any) => {
    const {
        connectors: { connect },
    } = useNode();
    return (
        <div ref={connect as any} className="text-only">
            {children}
        </div>
    );
};

CardTop.craft = {
    rules: {
        canMoveIn: (incomingNodes: any) =>
            incomingNodes.every(
                (incomingNode: {
                    data: { type: ({ text }: any) => JSX.Element };
                }) => incomingNode.data.type === Text,
            ),
    },
};

export const CardBottom = ({ children }: any) => {
    const {
        connectors: { connect },
    } = useNode();
    return <div ref={connect as any}>{children}</div>;
};

CardBottom.craft = {
    rules: {
        // Only accept Buttons
        canMoveIn: (incomingNodes: any) =>
            incomingNodes.every(
                (incomingNode: {
                    data: {
                        type: ({
                            size,
                            variant,
                            color,
                            children,
                        }: any) => JSX.Element;
                    };
                }) => incomingNode.data.type === Button,
            ),
    },
};

export const Card = ({ background, padding = 20 }: any) => {
    return (
        <Container background={background} padding={padding}>
            <Element id="text" is={CardTop} canvas={true}>
                <Text text="Title" fontSize={20} />
                <Text text="Subtitle" fontSize={15} />
            </Element>
            <Element id="buttons" is={CardBottom} canvas={true}>
                <Button size="small" text="Learn more" />
            </Element>
        </Container>
    );
};

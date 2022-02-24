import { ReactElement } from "react";

import { Element, useNode } from "@craftjs/core";

import type { CraftComponent } from "../types";

import { Button } from "./Button";
import {
    Container,
    ContainerDefaultProps,
    ContainerSettings,
} from "./Container";
import { Text } from "./Text";

interface PartialCardProps {
    children: ReactElement;
}

interface CardProps {
    background?: string;
    padding?: string | number;
}

export const CardTop: CraftComponent<PartialCardProps> = (
    props: PartialCardProps,
): ReactElement => {
    const {
        connectors: { connect },
    } = useNode();
    return (
        <div ref={connect as any} className="text-only">
            {props.children}
        </div>
    );
};

export const CardBottom: CraftComponent<PartialCardProps> = (
    props: PartialCardProps,
): ReactElement => {
    const {
        connectors: { connect },
    } = useNode();
    return <div ref={connect as any}>{props.children}</div>;
};

export const Card: CraftComponent<CardProps> = (
    props: CardProps,
): ReactElement => {
    const { background, padding } = props;
    return (
        <Container background={background as any} padding={padding as any}>
            <Element id="text" is={CardTop} canvas={true}>
                <Text text="Subtitle" fontSize={15} />
            </Element>
            <Element id="buttons" is={CardBottom} canvas={true}>
                <Button size="small" text="Learn more" />
            </Element>
        </Container>
    );
};

/**
 * The following rules are used to determine if a node can be moved into the
 * current node. It's important to note that these rules are only used when the
 * incoming node is being moved into the current node.
 *
 * @param incomingNodes - The incoming nodes that are being moved
 * into the current node.
 *
 * @returns true if the incoming nodes can be moved into the current
 * node, false otherwise.
 */

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

CardBottom.craft = {
    rules: {
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

Card.craft = {
    props: ContainerDefaultProps,
    related: {
        settings: ContainerSettings,
    },
};

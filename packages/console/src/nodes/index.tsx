import { Button } from "./Button";
import { Card, CardBottom, CardTop } from "./Card";
import { Container } from "./Container";
import { Text } from "./Text";

export interface CraftProps {
    craft: any;
}

export const nodeMappings = {
    Button,
    Card,
    CardTop,
    CardBottom,
    Container,
    Text,
};

export * from "./Text";
export * from "./Button";
export * from "./Container";
export * from "./Card";

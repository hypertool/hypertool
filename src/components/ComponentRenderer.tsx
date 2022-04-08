import type { FunctionComponent, ReactElement } from "react";
import { INode } from "../types";
import Button from "./Button";
import Fragment from "./Fragment";
import View from "./View";
import Text from "./Text";

export interface IProps {
  node: INode;
}

const componentMapping: Record<string, FunctionComponent<any>> = {
  Button,
  Fragment,
  View,
  Text,
};

const ComponentRenderer: FunctionComponent<IProps> = (
  props: IProps
): ReactElement => {
  const { node } = props;
  const { type, props: nodeProps } = node;
  const Component = componentMapping[type];

  if (!Component) {
    throw new Error(`Unknown component type "${type}".`);
  }

  return (
    <Component {...nodeProps} node={node}>
      {node.children.map((child) => (
        <ComponentRenderer key={child.internalId} node={child} />
      ))}
    </Component>
  );
};

export default ComponentRenderer;

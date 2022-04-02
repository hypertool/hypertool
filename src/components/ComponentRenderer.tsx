import type { FunctionComponent, ReactElement } from "react";
import { INode } from "../types";
import Button from "./Button";
import Fragment from "./Fragment";
import View from "./View";

export interface IProps {
  node: INode;
}

const componentMapping: Record<string, FunctionComponent<any>> = {
  Button,
  Fragment,
  View,
};

const ComponentRenderer: FunctionComponent<IProps> = (
  props: IProps
): ReactElement => {
  const { node } = props;
  const { type, props: nodeProps } = node;
  const Component = componentMapping[type];

  return (
    <Component {...nodeProps}>
      {node.children.map((child) => (
        <ComponentRenderer key={child.internalId} node={child} />
      ))}
    </Component>
  );
};

export default ComponentRenderer;

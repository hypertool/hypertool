import type { FunctionComponent, ReactElement } from "react";
import { INode } from "../types";

export interface IProps {
  node: INode;
}

const View: FunctionComponent<IProps> = (props: IProps): ReactElement => {
  const { node } = props;
  return (
    <div>
      {node.children.map((node) => (
        <View key={node.internalId} node={node} />
      ))}
    </div>
  );
};

export default View;

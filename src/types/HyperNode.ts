import type { INode, TPropertyValue } from ".";

export default class HyperNode implements INode {
  id: string;
  type: string;
  children: INode[];
  props: Record<string, TPropertyValue>;

  constructor(
    id: string,
    type: string,
    props: Record<string, TPropertyValue>,
    children: INode[]
  ) {
    this.id = id;
    this.type = type;
    this.children = children;
    this.props = props;
  }
}

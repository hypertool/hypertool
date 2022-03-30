import type { IComponentProps, INode, TPropertyValue } from ".";

export default class HyperNode implements INode {
  internalId: string;
  type: string;
  children: INode[];
  props: Record<string, TPropertyValue>;

  constructor(
    internalId: string,
    type: string,
    props: IComponentProps,
    children: INode[]
  ) {
    this.internalId = internalId;
    this.type = type;
    this.children = children;
    this.props = props;
  }
}

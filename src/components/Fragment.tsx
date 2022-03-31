import type { FunctionComponent, ReactElement } from "react";

export interface IProps {
  children: ReactElement;
}

const Fragment: FunctionComponent<IProps> = (props: IProps): ReactElement =>
  props.children;

export default Fragment;

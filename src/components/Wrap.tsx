import type { FunctionComponent, ReactElement } from "react";

import { Fragment } from "react";

interface Props {
  when: boolean;
  wrapper: FunctionComponent<any>;
  children: ReactElement;
  [key: string]: any;
}

const Wrap: FunctionComponent<Props> = (props: Props): ReactElement => {
  const { when, wrapper, children, ...wrapperProps } = props;
  const Component = when ? wrapper : Fragment;

  return <Component {...wrapperProps}>{children}</Component>;
};

export default Wrap;

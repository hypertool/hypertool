import type { FunctionComponent, ReactElement } from "react";
import { Fragment } from "react";

interface IProps {
    when: boolean;
    wrapper: FunctionComponent<any>;
    children: ReactElement;
    [key: string]: any;
}

const Wrap: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { when, wrapper, children, ...wrapperProps } = props;
    const Component = when ? wrapper : Fragment;

    return <Component {...wrapperProps}>{children}</Component>;
};

export default Wrap;

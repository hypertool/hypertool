import type { FunctionComponent, ReactElement } from "react";

export interface IProps {
    backgroundColor?: string;
    width?: string;
    height?: string;
    children?: ReactElement;
}

const View: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { backgroundColor, width, height, children } = props;
    return (
        <div
            onClick={() => alert("Hello, world!")}
            style={{ width, height, backgroundColor }}
        >
            {children}
        </div>
    );
};

export default View;

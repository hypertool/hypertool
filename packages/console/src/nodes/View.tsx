import type { FunctionComponent, ReactElement } from "react";

export interface IProps {
    backgroundColor?: string;
    width?: string;
    height?: string;
}

const View: FunctionComponent<IProps> = (props: IProps): ReactElement => {
    const { backgroundColor, width, height } = props;
    return (
        <div
            onClick={() => alert("Hello, world!")}
            style={{ width, height, backgroundColor }}
        ></div>
    );
};

export default View;

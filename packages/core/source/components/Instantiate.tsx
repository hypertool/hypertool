import type { FunctionComponent, ReactElement } from "react";

import React from "react";

export interface Props {
    path: string;
}

const Instantiate: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { path } = props;
    const Component = React.lazy(() => import("../../" + path.substr(7)));
    return <Component />;
};

export default Instantiate;

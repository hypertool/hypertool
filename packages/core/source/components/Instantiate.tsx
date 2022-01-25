import type { FunctionComponent, ReactElement } from "react";

import React from "react";

export interface Props {
    path: string;
    resolver: (path: string) => Promise<any>;
}

const Instantiate: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { path, resolver } = props;
    const Component = React.lazy(() => resolver(path));
    return <Component />;
};

export default Instantiate;

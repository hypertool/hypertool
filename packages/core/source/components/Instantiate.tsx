import type { FunctionComponent, ReactElement } from "react";

import React from "react";

export interface Props {
    path: string;
}

const Instantiate: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { path } = props;
    // Traversing from `node_modules/@hypertool/core/build/components`
    const actualPath = "../../../../../" + path;
    console.log("Resolving " + actualPath);
    const Component = React.lazy(() => import(actualPath));
    return <Component />;
};

export default Instantiate;

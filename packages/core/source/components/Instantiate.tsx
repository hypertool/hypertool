import type { FunctionComponent, ReactElement, ReactNode } from "react";

import React from "react";

export interface Props {
    path: string;
    resolver: (path: string) => Promise<any>;
    layouts?: {
        [key: string]: (element: ReactElement) => ReactNode;
    };
}

const Instantiate: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { path, resolver, layouts } = props;

    const Component = React.lazy(() => resolver(path));
    const { getLayout, layout } = Component as any;
    const child = <Component />;

    /* `getLayout` has higher priority. */
    let renderLayout = getLayout || (layouts && layouts[layout]);

    return renderLayout ? renderLayout(child) : child;
};

export default Instantiate;

import type { FunctionComponent, ReactElement } from "react";

import React, { lazy, useState, useEffect } from "react";

export interface Props {
    path: string;
    resolver: (path: string) => Promise<any>;
    layouts?: {
        [key: string]: (element: ReactElement) => ReactElement;
    };
}

interface Screen {
    layout?: string;

    /* `getLayout` has higher priority. */
    getLayout?: (element: ReactElement) => ReactElement;
}

const Instantiate: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { path, resolver, layouts } = props;
    const [target, setTarget] = useState<Screen | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const result = await resolver(path);
            console.log(result);
            if (mounted) {
                setTarget(result as unknown as Screen);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const Component = React.lazy(() => resolver(path));
    const { getLayout, layout } = target || {};
    let renderLayout = getLayout || (layouts && layout && layouts[layout]);

    return renderLayout ? renderLayout(<Component />) : <Component />;
};

export default Instantiate;

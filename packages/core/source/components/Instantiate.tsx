import type { FunctionComponent, ReactElement } from "react";

import React, { lazy, useState, useEffect } from "react";

export interface Props {
    path: string;
    resolver: (path: string) => Promise<any>;
    layouts?: {
        [key: string]: (element: ReactElement) => ReactElement;
    };
}

type GetLayout = (element: ReactElement) => ReactElement;

interface Screen {
    layout?: string;
    /* `getLayout` has higher priority. */
    getLayout?: GetLayout;
}

const Instantiate: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { path, resolver, layouts } = props;
    const [getLayout, setGetLayout] = useState<GetLayout | null>(null);
    const [layout, setLayout] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const result = await resolver(path);
            if (mounted) {
                const screen = result.default as unknown as Screen;
                setGetLayout((screen.getLayout as GetLayout) || null);
                setLayout((screen.layout as string) || null);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const Component = React.lazy(() => resolver(path));
    const renderLayout = getLayout || (layouts && layout && layouts[layout]);
    return renderLayout ? renderLayout(<Component />) : <Component />;
};

export default Instantiate;

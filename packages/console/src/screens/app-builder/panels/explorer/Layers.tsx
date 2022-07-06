import type { FunctionComponent, ReactElement } from "react";

import { LayerContextProvider } from "../../../../craft-layers/LayerContextProvider";
import { ROOT_NODE } from "../../../../craft-utils";

import type { LayerOptions } from "./interfaces";
import { LayerManagerProvider } from "./manager/LayerManagerProvider";

export { useLayer } from "../../../../craft-layers";

const Layers: FunctionComponent<Partial<LayerOptions>> = (
    props: Partial<LayerOptions>,
): ReactElement => {
    return (
        <LayerManagerProvider options={props}>
            <LayerContextProvider id={ROOT_NODE} depth={0} />
        </LayerManagerProvider>
    );
};

export default Layers;

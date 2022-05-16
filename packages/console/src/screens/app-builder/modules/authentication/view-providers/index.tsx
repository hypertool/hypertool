import type { FunctionComponent, ReactElement } from "react";

import { useUpdateTabTitle } from "../../../../../hooks";

const ViewProviders: FunctionComponent = (): ReactElement => {
    useUpdateTabTitle("View Providers");

    return <div>View Providers</div>;
};

export default ViewProviders;

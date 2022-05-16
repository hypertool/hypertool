import type { FunctionComponent, ReactElement } from "react";

import { useUpdateTabTitle } from "../../../../../hooks";

const ViewUsers: FunctionComponent = (): ReactElement => {
    useUpdateTabTitle("View Users");

    return <div>View Users</div>;
};

export default ViewUsers;

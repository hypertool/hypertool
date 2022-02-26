import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import ResourcesTable from "./ResourcesTable";

const Root = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

interface Props {
    onResourcesSelected: (resources: string[]) => void;
    selectedResources: string[];
}

const ResourcesStep: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { onResourcesSelected, selectedResources } = props;
    return (
        <Root>
            <ResourcesTable
                selectable={true}
                onResourcesSelected={onResourcesSelected}
                selectedResources={selectedResources}
            />
        </Root>
    );
};

export default ResourcesStep;

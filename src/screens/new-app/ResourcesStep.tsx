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

const ResourcesStep: FunctionComponent = (): ReactElement => {
  return (
    <Root>
      <ResourcesTable selectable={true} />
    </Root>
  );
};

export default ResourcesStep;

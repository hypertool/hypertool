import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

const Root = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  width: "100%",
}));

const ConfigureStep: FunctionComponent = (): ReactElement => {
  return (
    <Root>
      Select Step
    </Root>
  );
};

export default ConfigureStep;

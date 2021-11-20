import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import { ResourceType } from "../../types";
import MySQLForm from "./MySQLForm";
import PostgresForm from "./PostgresForm";

const Root = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  width: "100%",
}));

interface Props {
  activeType: ResourceType;
}

const ConfigureStep: FunctionComponent<Props> = (
  props: Props
): ReactElement => {
  const { activeType } = props;
  return <Root>
    {activeType === "postgres" && <PostgresForm />}
    {activeType === "mysql" && <MySQLForm />}
  </Root>;
};

export default ConfigureStep;

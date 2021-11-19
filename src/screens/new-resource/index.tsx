import { FunctionComponent, ReactElement } from "react";

import {
  Container as MuiContainer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { Wrap } from "../../components";
import NewResourceStepper from "./NewResourceStepper";

const Container = styled(MuiContainer)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(2),
}));

const NewResource: FunctionComponent = (): ReactElement => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  return (
    <Wrap when={matches} wrapper={Container}>
      <NewResourceStepper />
    </Wrap>
  );
};

export default NewResource;

import { FunctionComponent, ReactElement } from "react";

import { Container as MuiContainer } from "@mui/material";
import { styled } from "@mui/material/styles";

import Stepper from "./Stepper";

const Container = styled(MuiContainer)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(2),
}));

const NewApp: FunctionComponent = (): ReactElement => {
  return <Container><Stepper /></Container>;
};

export default NewApp;

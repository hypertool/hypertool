import type { FunctionComponent, ReactElement } from "react";

import { Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const Root = styled("section")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default),
  textAlign: "center",

  fontWeight: 900,
  fontSize: 24,

  [theme.breakpoints.up("md")]: {
    fontWeight: 900,
    fontSize: 28,
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default),
  fontWeight: 400,
  textAlign: "center",
  marginTop: theme.spacing(1),

  fontSize: 14,

  [theme.breakpoints.up("md")]: {
    fontSize: 18,
    maxWidth: 400,
  }
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(1),
  textTransform: "none",

  width: "100%",

  [theme.breakpoints.up("md")]: {
    width: 264,
  },
}));

const Login: FunctionComponent = (): ReactElement => {
  return (
    <Root>
      <SectionTitle>Welcome to HyperTool</SectionTitle>
      <SectionSubtitle>
        Don't have an account? No worries, we'll create it for you.
      </SectionSubtitle>
      <PrimaryAction variant="contained" color="primary" size="medium">
        Continue with Google
      </PrimaryAction>
    </Root>
  );
};

export default Login;

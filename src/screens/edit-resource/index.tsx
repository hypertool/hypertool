import type { FunctionComponent, ReactElement } from "react";

import { Typography, Divider, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const Root = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  padding: theme.spacing(4),
}));

const Left = styled("div")(({ theme }) => ({
  maxWidth: 280,
  marginRight: theme.spacing(4),
}));

const Right = styled("div")(({ theme }) => ({
  width: "100%",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 500,
  color: theme.palette.getContrastText(theme.palette.background.default),
}));

const Help = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.getContrastText(theme.palette.background.default),
  lineHeight: 1.5,
  marginTop: theme.spacing(1),
})) as any;

const EditResource: FunctionComponent = (): ReactElement => {
  return (
    <Root>
      <Left>
        <Title variant="h1">Edit resource</Title>
        <Help component="p" variant="caption">
          Resources let you connect to your database or API. Once you add a
          resource here, you can choose which app has access to which resource.
        </Help>
      </Left>

      <Divider orientation="vertical" flexItem={true} sx={{ mr: 4 }} />

      <Right></Right>
    </Root>
  );
};

export default EditResource;

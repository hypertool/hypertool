import type { FunctionComponent, ReactElement } from "react";

import {
  Typography,
  Divider,
  Container,
  AppBar,
  Toolbar,
  Button,
  Icon,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Title = styled(Typography)(({ theme }) => ({}));

const WorkspaceToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ActionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
}));

const Root = styled("div")(({ theme }) => ({
  width: "100%",
}));

const Left = styled("div")(({ theme }) => ({
  maxWidth: 280,
  marginRight: theme.spacing(4),
}));

const Right = styled("div")(({ theme }) => ({
  width: "100%",
}));

const Help = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.getContrastText(theme.palette.background.default),
  lineHeight: 1.5,
  marginTop: theme.spacing(1),
})) as any;

const ActionIcon = styled(Icon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const Content = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  padding: theme.spacing(4),
}));

const EditResource: FunctionComponent = (): ReactElement => {
  const handleCreateNew = () => {};

  return (
    <Root>
      <AppBar position="static" elevation={1}>
        <WorkspaceToolbar>
          <Title>Resource Library</Title>
          <ActionContainer>
            <Button
              size="small"
              onClick={handleCreateNew}
              color="inherit"
              sx={{ mr: 2 }}
            >
              <ActionIcon fontSize="small">cancel</ActionIcon>
              Disable
            </Button>
            <Button
              size="small"
              color="inherit"
              onClick={handleCreateNew}
              sx={{ mr: 2 }}
            >
              <ActionIcon fontSize="small">delete</ActionIcon>
              Delete
            </Button>
            <Button
              size="small"
              onClick={handleCreateNew}
              color="inherit"
              sx={{ mr: 2 }}
            >
              <ActionIcon fontSize="small">refresh</ActionIcon>
              Refresh
            </Button>
            <Button size="small" onClick={handleCreateNew} color="inherit">
              <ActionIcon fontSize="small">save</ActionIcon>
              Save
            </Button>
          </ActionContainer>
        </WorkspaceToolbar>
      </AppBar>
      <Content>
        <Left>
          <Help component="p" variant="caption">
            Resources let you connect to your database or API. Once you add a
            resource here, you can choose which app has access to which
            resource.
          </Help>
        </Left>

        <Divider orientation="vertical" flexItem={true} sx={{ mr: 4 }} />

        <Right></Right>
      </Content>
    </Root>
  );
};

export default EditResource;

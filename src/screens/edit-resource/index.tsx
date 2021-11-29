import type { FunctionComponent, ReactElement } from "react";

import {
  Typography,
  Divider,
  Container,
  AppBar,
  Toolbar,
  Button,
  Icon,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import { useParams } from "react-router";
import { gql, useQuery } from "@apollo/client";

import PostgresForm from "../new-resource/PostgresForm";

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

const ProgressContainer = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 192px)",
  justifyContent: "center",
  alignItems: "center",
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
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 192px)",
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

const GET_RESOURCE = gql`
  query GetResource($resourceId: ID!) {
    getResourceById(resourceId: $resourceId) {
      id
      name
      type
      status
      createdAt
    }
  }
`;

const EditResource: FunctionComponent = (): ReactElement => {
  const { resourceId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_RESOURCE, {
    variables: {
      resourceId,
    },
  });

  const handleCreateNew = () => {};

  const handleSubmit = () => {};

  const renderProgress = () => (
    <ProgressContainer>
      <CircularProgress size="28px" />
    </ProgressContainer>
  );

  const renderForms = () => (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      <PostgresForm />
    </Formik>
  );

  return (
    <Root>
      <AppBar position="static" elevation={1}>
        <WorkspaceToolbar>
          <Title>Edit Resource</Title>
          <ActionContainer>
            <Button
              size="small"
              onClick={handleCreateNew}
              color="inherit"
              sx={{ mr: 2 }}
              disabled={loading}
            >
              <ActionIcon fontSize="small">cancel</ActionIcon>
              Disable
            </Button>
            <Button
              size="small"
              color="inherit"
              onClick={handleCreateNew}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              <ActionIcon fontSize="small">delete</ActionIcon>
              Delete
            </Button>
            <Button
              size="small"
              onClick={handleCreateNew}
              color="inherit"
              sx={{ mr: 2 }}
              disabled={loading}
            >
              <ActionIcon fontSize="small">refresh</ActionIcon>
              Refresh
            </Button>
            <Button
              size="small"
              onClick={handleCreateNew}
              color="inherit"
              disabled={loading}
            >
              <ActionIcon fontSize="small">save</ActionIcon>
              Save
            </Button>
          </ActionContainer>
        </WorkspaceToolbar>
      </AppBar>
      {loading && renderProgress()}
      {!loading && (
        <Content>
          <Left>
            <Help component="p" variant="caption">
              Resources let you connect to your database or API. Once you add a
              resource here, you can choose which app has access to which
              resource.
            </Help>
          </Left>

          <Divider orientation="vertical" flexItem={true} sx={{ mr: 4 }} />

          <Right>{renderForms()}</Right>
        </Content>
      )}
    </Root>
  );
};

export default EditResource;

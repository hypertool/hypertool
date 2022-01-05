import type { FunctionComponent, ReactElement } from "react";

import { useCallback, useEffect } from "react";
import {
  Button,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircle from "@mui/icons-material/CheckCircle";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router";

import FormHelper from "./FormHelper";
import Wrap from "../../components/Wrap";

const StepContainer = styled("div")(({ theme }) => ({
  height: "calc(100vh - 200px)",
}));

const ActionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
}));

const CreateAction = styled(Button)(({ theme }) => ({
  width: 144,
}));

interface FormValues {
  name: string;
  description: string;
}

const initialValues: FormValues = {
  name: "",
  description: "",
};

const validationSchema = yup.object({
  name: yup
    .string()
    .max(128, "Name should be 128 characters or less")
    .required("Name is required"),
  description: yup
    .string()
    .max(512, "Description should be 512 characters or less"),
});

const CREATE_APP = gql`
  mutation CreateApp(
    $name: String!
    $description: String
    $groups: [ID!]
    $resources: [ID!]
  ) {
    createApp(
      name: $name
      description: $description
      groups: $groups
      resources: $resources
    ) {
      id
    }
  }
`;

const NewOrganization: FunctionComponent = (): ReactElement => {
  // TODO: Destructure `error`, check for non-null, send to sentry
  const [
    createApp,
    { loading: creatingApp, data: newApp },
  ] = useMutation(CREATE_APP);
  const theme = useTheme();
  const navigate = useNavigate();
  const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    if (newApp) {
      navigate(`/apps/${newApp.createApp.id}/edit`);
    }
  }, [navigate, newApp]);

  const handleSubmit = useCallback(
    (values: FormValues, helpers: FormikHelpers<FormValues>): void => {
      createApp({
        variables: {
          ...values,
        },
      });
    },
    [createApp]
  );

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <>

            <Typography sx={{ color: 'white' }}>Create your organization</Typography>
            <Wrap
              when={smallerThanLg}
              wrapper={Container}
              style={{ height: "calc(100vh - 156px)" }}
            >
              <Wrap when={!smallerThanLg} wrapper={StepContainer}>
                <FormHelper />
              </Wrap>
            </Wrap>

            <ActionContainer>
              <CreateAction
                onClick={() => formik.submitForm()}
                variant="contained"
                size="small"
                disabled={creatingApp}
              >
                Create
                {!creatingApp && !newApp && (
                  <CheckCircleOutline fontSize="small" sx={{ ml: 1 }} />
                )}
                {!creatingApp && newApp && (
                  <CheckCircle fontSize="small" sx={{ ml: 1 }} />
                )}
                {creatingApp && (
                  <CircularProgress size="14px" sx={{ ml: 1 }} />
                )}
              </CreateAction>
            </ActionContainer>
          </>
        )}
      </Formik>
    </div>
  );
};

export default NewOrganization;

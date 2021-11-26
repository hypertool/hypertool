import type { FunctionComponent, ReactElement } from "react";

import {
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Formik } from "formik";
import * as yup from "yup";

import { TextField } from "../../components";

const TextFieldHelp = styled(Typography)(({ theme }) => ({
  display: "flex",
  marginTop: 4,
  flexDirection: "column",
  marginLeft: -8,
  marginBottom: 0,
  paddingBottom: 0,
}));

const ResourceNameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
})) as any;

const HostTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(2),
})) as any;

const PortTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(2),
})) as any;

const DatabaseNameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(2),
})) as any;

const DatabaseUserNameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(2),
})) as any;

const DatabasePasswordTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  marginTop: theme.spacing(2),
})) as any;

const SSLLabel = styled(FormControlLabel)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default),
  marginTop: theme.spacing(1),
}));

interface FormValues {
  resourceName: string;
  host: string;
  port: string;
  databaseName: string;
  databaseUserName: string;
  databasePassword: string;
  connectUsingSSL: boolean;
}

const initialValues: FormValues = {
  resourceName: "",
  host: "",
  port: "",
  databaseName: "",
  databaseUserName: "",
  databasePassword: "",
  connectUsingSSL: false,
};

const validationSchema = yup.object({
  resourceName: yup
    .string()
    .max(256, "Resource name should 256 characters or less")
    .required("Resource name is required"),
  host: yup.string().required("Host is required"),
  port: yup
    .number()
    .typeError("Port number should be an integer")
    .integer("Port number should be an integer")
    .required("Port number is required"),
  databaseName: yup.string().required("Please specify a valid database name"),
  databaseUserName: yup
    .string()
    .required("Please specify a valid database user name"),
  databasePassword: yup
    .string()
    .required("Please specify a valid database password"),
  connectUsingSSL: yup.boolean().default(false),
});

const PostgresForm: FunctionComponent = (): ReactElement => {
  const handleSubmit = (values: FormValues) => {};

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <>
        <ResourceNameTextField
          name="resourceName"
          required={true}
          id="resourceName"
          label="Resource Name"
          size="small"
          variant="outlined"
          fullWidth={true}
          help={
            <TextFieldHelp variant="caption">
              The resource name will help you identify the resource across
              Hypertool, including HTX and JavaScript code.
            </TextFieldHelp>
          }
        />

        <HostTextField
          name="host"
          required={true}
          id="host"
          label="Host"
          size="small"
          variant="outlined"
          fullWidth={true}
        />

        <PortTextField
          name="port"
          required={true}
          id="port"
          label="Port"
          size="small"
          variant="outlined"
          fullWidth={true}
        />

        <DatabaseNameTextField
          name="databaseName"
          required={true}
          id="databaseName"
          label="Database Name"
          size="small"
          variant="outlined"
          fullWidth={true}
        />

        <DatabaseUserNameTextField
          name="databaseUserName"
          required={true}
          id="databaseUserName"
          label="User Name"
          size="small"
          variant="outlined"
          fullWidth={true}
        />

        <DatabasePasswordTextField
          name="databasePassword"
          required={true}
          id="databasePassword"
          label="Password"
          size="small"
          variant="outlined"
          type="password"
          fullWidth={true}
        />

        <SSLLabel
          control={<Checkbox name="connectUsingSSL" defaultChecked={false} />}
          label="Connect using SSL"
        />
      </>
    </Formik>
  );
};

export default PostgresForm;

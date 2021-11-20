import type { FunctionComponent, ReactElement } from "react";

import {
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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

const TextFieldHelp = styled(Typography)(({ theme }) => ({
  display: "flex",
  marginTop: 4,
  flexDirection: "column",
  marginLeft: -8,
  marginBottom: 0,
  paddingBottom: 0,
}));

const SSLLabel = styled(FormControlLabel)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default),
  marginTop: theme.spacing(1),
}));

const PostgresForm: FunctionComponent = (): ReactElement => {
  return (
    <>
      <ResourceNameTextField
        required={true}
        id="resourceName"
        label="Resource Name"
        size="small"
        variant="outlined"
        fullWidth={true}
        helperText={
          <TextFieldHelp variant="caption">
            The resource name will help you identify the resource across
            Hypertool, including HTX and JavaScript code.
          </TextFieldHelp>
        }
      />

      <HostTextField
        required={true}
        id="host"
        label="Host"
        size="small"
        variant="outlined"
        fullWidth={true}
      />

      <PortTextField
        required={true}
        id="port"
        label="Port"
        size="small"
        variant="outlined"
        fullWidth={true}
      />

      <DatabaseNameTextField
        required={true}
        id="databaseName"
        label="Database Name"
        size="small"
        variant="outlined"
        fullWidth={true}
      />

      <DatabaseUserNameTextField
        required={true}
        id="databaseUserName"
        label="User Name"
        size="small"
        variant="outlined"
        fullWidth={true}
      />

      <DatabasePasswordTextField
        required={true}
        id="databasePassword"
        label="Password"
        size="small"
        variant="outlined"
        type="password"
        fullWidth={true}
      />

      <SSLLabel
        control={<Checkbox defaultChecked={false} />}
        label="Connect using SSL"
      />
    </>
  );
};

export default PostgresForm;

import type { FunctionComponent, ReactElement } from "react";

import {
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const ResourceNameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
})) as any;

const TextFieldHelp = styled(Typography)(({ theme }) => ({
  display: "flex",
  marginTop: 4,
  flexDirection: "column",
  marginLeft: -8,
  marginBottom: 0,
  paddingBottom: 0,
}));

const KeyTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 600,
  marginTop: theme.spacing(2),
})) as any;

const BigQueryForm: FunctionComponent = (): ReactElement => {
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

      <KeyTextField
        required={true}
        id="serviceAccountKey"
        label="Service Account Key"
        size="small"
        variant="outlined"
        fullWidth={true}
        multiline={true}
        rows={10}
      />
    </>
  );
};

export default BigQueryForm;

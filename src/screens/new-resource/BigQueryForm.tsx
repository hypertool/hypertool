import type { FunctionComponent, ReactElement } from "react";

import {
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextField } from "../../components";

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
        id="resourceName"
        name="resourceName"
        required={true}
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

      <KeyTextField
        id="serviceAccountKey"
        name="serviceAccountKey"
        required={true}
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

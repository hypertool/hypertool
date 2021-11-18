import type { FunctionComponent, ReactElement } from "react";
import { SelectChangeEvent, Typography } from "@mui/material";

import { useState, useCallback } from "react";
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Root = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),

  height: `calc(100vh - 300px)`,
  width: "100%",
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
}));

const NameTextField = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
})) as any;

const DescriptionTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(3),
  maxWidth: 600,
})) as any;

const FolderFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(4),
  maxWidth: 400,
}));

const dummyFolders = ["eCommerce", "content", "human-resource", "tech"];

const AboutStep: FunctionComponent = (): ReactElement => {
  const [folder, setFolder] = useState("root");

  const handleFolderChange = useCallback((event: SelectChangeEvent) => {
    setFolder(event.target.value);
  }, []);

  return (
    <Root>
      <Form>
        <NameTextField
          required={true}
          id="name"
          label="Name"
          size="small"
          variant="outlined"
          fullWidth={true}
          helperText={
            <Typography
              variant="caption"
              style={{
                display: "flex",
                marginTop: 4,
                flexDirection: "column",
                marginLeft: -8,
                marginBottom: 0,
                paddingBottom: 0,
              }}
            >
              Good app names are short and memorable.
              <br />
              Your app will be hosted at:
              <a
                href="https://trell.hypertool.io/thumbnail-generator"
                target="_blank"
                rel="noreferrer"
                style={{ color: "white" }}
              >
                https://trell.hypertool.io/thumbnail-generator
              </a>
            </Typography>
          }
        />
        <DescriptionTextField
          id="description"
          label="Description"
          size="small"
          variant="outlined"
          multiline={true}
          rows={5}
          fullWidth={true}
          helperText={
            <Typography
              variant="caption"
              style={{
                display: "flex",
                marginTop: 4,
                flexDirection: "column",
                marginLeft: -8,
                marginBottom: 0,
                paddingBottom: 0,
              }}
            >
              A good description will help your users know about your app
              better.
            </Typography>
          }
        />
        <FolderFormControl fullWidth={true}>
          <InputLabel id="folder-label">Folder</InputLabel>
          <Select
            labelId="folder-label"
            id="folder"
            value={folder}
            label="Folder"
            onChange={handleFolderChange}
            size="small"
            variant="outlined"
          >
            <MenuItem value="root">root</MenuItem>
            {dummyFolders.map((folder) => (
              <MenuItem value={folder}>{folder}</MenuItem>
            ))}
          </Select>
        </FolderFormControl>
      </Form>
    </Root>
  );
};

export default AboutStep;

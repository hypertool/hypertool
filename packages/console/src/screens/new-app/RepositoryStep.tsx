import type { FunctionComponent, ReactElement } from "react";
import { SelectChangeEvent } from "@mui/material";

import { useState, useCallback } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import GitHubForm from "./GitHubForm";

const Root = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  paddingBottom: theme.spacing(4),
  width: "100%",
}));

const Form = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
}));

const PlatformFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(4),
  maxWidth: 400,
}));

const platforms = [
  {
    title: "GitHub",
    value: "github",
  },
  {
    title: "GitLab",
    value: "gitlab",
  },
  {
    title: "Google Cloud Source Repositories",
    value: "google_cloud_source_repositories",
  },
  {
    title: "AWS CodeCommit",
    value: "aws_codecommit",
  },
  {
    title: "Azure Repos",
    value: "azure_repos",
  },
];

const RepositoryStep: FunctionComponent = (): ReactElement => {
  const [platform, setPlatform] = useState("github");

  const handlePlatformChange = useCallback((event: SelectChangeEvent) => {
    setPlatform(event.target.value);
  }, []);

  return (
    <Root>
      <Form>
        <PlatformFormControl fullWidth={true}>
          <InputLabel id="platform-label">Platform</InputLabel>
          <Select
            labelId="platform-label"
            id="platform"
            value={platform}
            label="Platform"
            onChange={handlePlatformChange}
            size="small"
            variant="outlined"
          >
            {platforms.map((platform) => (
              <MenuItem value={platform.value}>{platform.title}</MenuItem>
            ))}
          </Select>
        </PlatformFormControl>
        {platform === "github" && <GitHubForm />}
      </Form>
    </Root>
  );
};

export default RepositoryStep;

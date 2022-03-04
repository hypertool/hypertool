import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import { TextField } from "../../components";

const ResourceNameTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 600,
})) as any;

const Root = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

const ConfigureStep: FunctionComponent = (): ReactElement => {
    return (
        <Root>
            <ResourceNameTextField
                name="query"
                required={true}
                multiline={true}
                rows={10}
                id="query"
                label="Query"
                size="small"
                variant="outlined"
                fullWidth={true}
            />
        </Root>
    );
};

export default ConfigureStep;

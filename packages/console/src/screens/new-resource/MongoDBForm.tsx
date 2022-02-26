import type { FunctionComponent, ReactElement } from "react";

import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { TextField } from "../../components";

const ResourceNameTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
})) as any;

const HostTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
})) as any;

const PortTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
})) as any;

const DatabaseNameTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
})) as any;

const DatabaseUserNameTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
})) as any;

const DatabasePasswordTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
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
    marginTop: theme.spacing(2),
}));

const MongoDBForm: FunctionComponent = (): ReactElement => {
    return (
        <>
            <ResourceNameTextField
                name="resourceName"
                id="resourceName"
                required={true}
                label="Resource Name"
                size="small"
                variant="outlined"
                fullWidth={true}
                helperText={
                    <TextFieldHelp variant="caption">
                        The resource name will help you identify the resource
                        across Hypertool, including HTX and JavaScript code.
                    </TextFieldHelp>
                }
            />

            <HostTextField
                id="host"
                name="host"
                required={true}
                label="Host"
                size="small"
                variant="outlined"
                fullWidth={true}
            />

            <PortTextField
                id="port"
                name="port"
                required={true}
                label="Port"
                size="small"
                variant="outlined"
                fullWidth={true}
            />

            <DatabaseNameTextField
                id="databaseName"
                name="databaseName"
                required={true}
                label="Database Name"
                size="small"
                variant="outlined"
                fullWidth={true}
            />

            <DatabaseUserNameTextField
                id="databaseUserName"
                name="databaseUserName"
                required={true}
                label="User Name"
                size="small"
                variant="outlined"
                fullWidth={true}
            />

            <DatabasePasswordTextField
                id="databasePassword"
                name="databasePassword"
                required={true}
                label="Password"
                size="small"
                variant="outlined"
                type="password"
                fullWidth={true}
            />

            <SSLLabel
                control={
                    <Checkbox name="connectUsingSSL" defaultChecked={false} />
                }
                label="Connect using SSL"
            />
        </>
    );
};

export default MongoDBForm;

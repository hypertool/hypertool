import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
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

const ResourceFormControl = styled(FormControl)(({ theme }) => ({
    marginTop: theme.spacing(4),
    maxWidth: 400,
}));

const Root = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

const resources = [
    "trell",
    "itsacademyjs",
    "hypertool",
    "paywall",
    "itshubble",
    "madewithonecube",
];

const ConfigureStep: FunctionComponent = (): ReactElement => {
    const [resource, setResource] = useState("itssamuelrowe");

    const handleResourceChange = useCallback((event: SelectChangeEvent) => {
        setResource(event.target.value);
    }, []);

    return (
        <Root>
            <ResourceNameTextField
                name="name"
                required={true}
                id="name"
                label="Name"
                size="small"
                variant="outlined"
                fullWidth={true}
                helperText={
                    <TextFieldHelp variant="caption">
                        The query name will help you identify the query across
                        your Hypertool app, including code.
                    </TextFieldHelp>
                }
            />

            <ResourceFormControl fullWidth={true}>
                <InputLabel id="resource-label">Resource</InputLabel>
                <Select
                    labelId="resource-label"
                    id="resource"
                    value={resource}
                    label="Resource"
                    onChange={handleResourceChange}
                    variant="outlined"
                    size="small"
                >
                    {resources.map((resource) => (
                        <MenuItem value={resource}>{resource}</MenuItem>
                    ))}
                </Select>
            </ResourceFormControl>
        </Root>
    );
};

export default ConfigureStep;

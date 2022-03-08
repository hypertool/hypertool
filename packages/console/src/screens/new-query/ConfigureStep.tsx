import type { FunctionComponent, ReactElement } from "react";

import { MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Select, TextField } from "../../components";

const NameTextField = styled(TextField)({
    maxWidth: 400,
}) as any;

const DescriptionTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
}));

const TextFieldHelp = styled(Typography)({
    display: "flex",
    marginTop: 4,
    flexDirection: "column",
    marginLeft: -8,
    marginBottom: 0,
    paddingBottom: 0,
});

const Root = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

const ResourceSelect = styled("div")(({ theme }) => ({
    width: 400,
    marginTop: theme.spacing(3),
}));

export interface IProps {
    resources: any[];
}

const ConfigureStep: FunctionComponent<IProps> = (
    props: IProps,
): ReactElement => {
    const { resources } = props;

    return (
        <Root>
            <NameTextField
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

            <DescriptionTextField
                name="description"
                id="description"
                label="Description"
                size="small"
                variant="outlined"
                multiline={true}
                rows={4}
                fullWidth={true}
                help=""
            />

            <ResourceSelect>
                <Select
                    id="resource"
                    name="resource"
                    label="Resource"
                    variant="outlined"
                    size="small"
                    help=""
                    renderMenuItems={() =>
                        resources.map((resource) => (
                            <MenuItem value={resource.id}>
                                {resource.name}
                            </MenuItem>
                        ))
                    }
                />
            </ResourceSelect>
        </Root>
    );
};

export default ConfigureStep;

import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import { TextField } from "../../components";

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    width: "100%",
}));

const NameTextField = styled(TextField)({
    maxWidth: 400,
});

const TitleTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
}));

const AppDetailsStep: FunctionComponent = (): ReactElement => {
    return (
        <FormRoot>
            <NameTextField
                required={true}
                name="name"
                id="name"
                label="Name"
                size="small"
                variant="outlined"
                fullWidth={true}
                help=""
            />
            <TitleTextField
                required={true}
                name="title"
                id="title"
                label="Title"
                size="small"
                variant="outlined"
                fullWidth={true}
                help=""
            />
        </FormRoot>
    );
};

export default AppDetailsStep;

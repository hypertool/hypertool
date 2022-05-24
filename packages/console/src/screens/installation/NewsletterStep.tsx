import type { FunctionComponent, ReactElement } from "react";

import { FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Checkbox, TextField } from "../../components";

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    width: "100%",
}));

const EmailAddressTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(2),
    maxWidth: 400,
}));

const NewsletterLabel = styled(FormControlLabel)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    marginTop: theme.spacing(2),
}));

const NewsletterStep: FunctionComponent = (): ReactElement => {
    return (
        <FormRoot>
            <EmailAddressTextField
                name="emailAddress"
                id="emailAddress"
                label="Email Address"
                size="small"
                variant="outlined"
                required={true}
                fullWidth={true}
            />

            <NewsletterLabel
                control={<Checkbox name="newsletter" />}
                label="Get infrequent emails about new releases and feature updates"
            />
        </FormRoot>
    );
};

export default NewsletterStep;

import { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import { Password, TextField } from "../../components";

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    width: "100%",
}));

const FirstNameTextField = styled(TextField)({
    maxWidth: 400,
});

const LastNameTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(2),
    maxWidth: 400,
}));

const EmailAddressTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(2),
    maxWidth: 400,
}));

const PasswordTextField = styled("div")(({ theme }) => ({
    marginTop: theme.spacing(2),
    maxWidth: 400,
}));

const AdministratorDetailsStep: FunctionComponent = (): ReactElement => {
    return (
        <FormRoot>
            <FirstNameTextField
                name="firstName"
                id="firstName"
                label="First Name"
                size="small"
                variant="outlined"
                required={true}
                fullWidth={true}
            />

            <LastNameTextField
                name="lastName"
                id="lastName"
                label="Last Name"
                size="small"
                variant="outlined"
                required={true}
                fullWidth={true}
            />

            <EmailAddressTextField
                name="emailAddress"
                id="emailAddress"
                label="Email Address"
                size="small"
                variant="outlined"
                required={true}
                fullWidth={true}
            />

            <PasswordTextField>
                <Password
                    id="Password"
                    label="Password"
                    variant="outlined"
                    name="password"
                    size="small"
                    help=""
                    fullWidth={true}
                    required={true}
                />
            </PasswordTextField>
        </FormRoot>
    );
};

export default AdministratorDetailsStep;

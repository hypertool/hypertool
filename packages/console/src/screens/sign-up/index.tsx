import { FunctionComponent, ReactElement, useCallback } from "react";
import { Typography, Button, TextField } from "@mui/material";
import { useGoogleLogin } from "react-google-login";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router";

import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

import { Formik } from "formik";
import * as yup from "yup";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(8),
}));

const EmailForm = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
}));

const InputField = styled(TextField)(({ theme }) => ({
    width: "100%",
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,

    [theme.breakpoints.up("md")]: {
        fontWeight: 400,
        fontSize: 22,
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    textAlign: "center",

    fontWeight: 900,
    fontSize: 24,

    [theme.breakpoints.up("md")]: {
        fontWeight: 900,
        fontSize: 28,
    },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontWeight: 400,
    textAlign: "center",
    marginTop: theme.spacing(1),

    fontSize: 14,

    [theme.breakpoints.up("md")]: {
        fontSize: 18,
        maxWidth: 400,
    },
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
    textTransform: "none",
    width: "100%",
    [theme.breakpoints.up("md")]: {
        width: 360,
    },
}));

interface FormValues {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
}

const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
};

const validationSchema = yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    emailAddress: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
});

const SignUp: FunctionComponent = (): ReactElement => {
    const handleSubmit = (values: FormValues) => {};

    return (
        <Root>
            <SectionTitle>Welcome to HyperTool</SectionTitle>
            <SectionSubtitle>Sign-Up with Email</SectionSubtitle>
            <EmailForm>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}>
                    {(formik) => (
                        <>
                            <InputField
                                id="outlined-basic"
                                label="First Name"
                                variant="outlined"
                                name="firstName"
                                size="small"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                            />
                            <InputField
                                id="secret"
                                label="Last Name"
                                variant="outlined"
                                name="lastName"
                                size="small"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                            />
                            <InputField
                                id="secret"
                                label="Email Address"
                                variant="outlined"
                                name="emailAddress"
                                size="small"
                                value={formik.values.emailAddress}
                                onChange={formik.handleChange}
                            />
                            <InputField
                                id="secret"
                                label="Password"
                                variant="outlined"
                                name="password"
                                size="small"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                            <PrimaryAction
                                variant="outlined"
                                color="primary"
                                size="medium"
                                onClick={() => formik.submitForm()}>
                                Sign-Up
                            </PrimaryAction>
                        </>
                    )}
                </Formik>
            </EmailForm>
        </Root>
    );
};

export default SignUp;

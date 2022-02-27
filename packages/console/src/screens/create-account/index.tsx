/* eslint-disable no-undef */
import {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
} from "react";

import { Button, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { PublicClient } from "@hypertool/common";

import * as yup from "yup";
import { Formik } from "formik";

import { TextField } from "../../components";

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

const FormContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
}));

const InputField = styled(TextField)(({ theme }) => ({
    width: "100%",
    marginBottom: theme.spacing(1),

    [theme.breakpoints.up("md")]: {
        fontWeight: 400,
        fontSize: 22,
    },
}));

const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    textAlign: "center",
    marginBottom: theme.spacing(3),

    fontWeight: 900,
    fontSize: 24,

    [theme.breakpoints.up("md")]: {
        fontWeight: 900,
        fontSize: 28,
    },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontWeight: 400,
    textAlign: "center",
    marginBottom: theme.spacing(2),
    fontSize: 14,

    [theme.breakpoints.up("md")]: {
        fontSize: 18,
    },
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
    textTransform: "none",
    width: "100%",
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

const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validationSchema = yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    emailAddress: yup
        .string()
        .email("Must be a valid Email")
        .required("Email is required"),
    password: yup
        .string()
        .matches(regex, {
            message:
                "Minimum 8 characters, containing alphanumeric and symbolic characters",
            excludeEmptyString: true,
        })
        .required("Password is required"),
});

const CreateAccount: FunctionComponent = (): ReactElement => {
    useEffect(() => {
        document.title = "Create Account | Hypertool";
    }, []);
    const appName = "manage-users"; /* Temporary Declaration */
    // const publicClient = useMemo(() => new PublicClient(appName), [appName]);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleSubmit = () => {};

    /*
     * const handleSubmit = useCallback(
     *     async (values: FormValues) => {
     *         (publicClient as any).createAccount({
     *             firstName: values.firstName,
     *             lastName: values.lastName,
     *             role: "developer",
     *             emailAddress: values.emailAddress,
     *             password: values.password,
     *         });
     *     },
     *     [publicClient],
     * );
     */

    return (
        <Root>
            <Title>Welcome to HyperTool</Title>
            <Card>
                <CardContent>
                    <Subtitle>Create Account</Subtitle>

                    <FormContainer>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >
                            {(formik) => (
                                <>
                                    <InputField
                                        id="firstName"
                                        label="First Name"
                                        variant="outlined"
                                        name="firstName"
                                        size="small"
                                        onChange={formik.handleChange}
                                        help=""
                                    />
                                    <InputField
                                        id="lastName"
                                        label="Last Name"
                                        variant="outlined"
                                        name="lastName"
                                        size="small"
                                        onChange={formik.handleChange}
                                        help=""
                                    />
                                    <InputField
                                        id="email"
                                        label="Email Address"
                                        variant="outlined"
                                        name="emailAddress"
                                        size="small"
                                        onChange={formik.handleChange}
                                        help=""
                                    />
                                    <InputField
                                        id="password"
                                        label="Password"
                                        variant="outlined"
                                        name="password"
                                        size="small"
                                        onChange={formik.handleChange}
                                        helperText="Minimum 8 characters, containing alphanumeric and symbolic characters"
                                        help=""
                                    />
                                    <PrimaryAction
                                        variant="contained"
                                        color="primary"
                                        size="medium"
                                        onClick={() => formik.submitForm()}
                                    >
                                        Create Account
                                    </PrimaryAction>
                                </>
                            )}
                        </Formik>
                    </FormContainer>
                </CardContent>
            </Card>
        </Root>
    );
};

export default CreateAccount;

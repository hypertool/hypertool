import { FunctionComponent, ReactElement, useCallback, useEffect } from "react";
import {
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

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

const validationSchema = yup.object().shape({
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

const client = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}/graphql/v1/public`,
    cache: new InMemoryCache(),
});

const CREATE_ACCOUNT = gql`
    mutation SignUpWithEmail(
        $firstName: String!
        $lastName: String!
        $role: String
        $emailAddress: String!
        $password: String!
    ) {
        signupWithEmail(
            firstName: $firstName
            lastName: $lastName
            role: $role
            emailAddress: $emailAddress
            password: $password
        ) {
            id
        }
    }
`;

const CreateAccount: FunctionComponent = (): ReactElement => {
    useEffect(() => {
        document.title = "Create Account | Hypertool";
    }, []);

    const handleSubmit = useCallback(async (values: FormValues) => {
        const result = await client.mutate({
            mutation: CREATE_ACCOUNT,
            variables: {
                firstName: values.firstName,
                lastName: values.lastName,
                role: "developer",
                emailAddress: values.emailAddress,
                password: values.password,
            },
        });
        console.log(result);
    }, []);

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
                            validationSchema={validationSchema}>
                            {(formik) => (
                                <>
                                    <InputField
                                        id="firstName"
                                        label="First Name"
                                        variant="outlined"
                                        name="firstName"
                                        size="small"
                                        type="text"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                    />
                                    <InputField
                                        id="lastName"
                                        label="Last Name"
                                        variant="outlined"
                                        name="lastName"
                                        size="small"
                                        type="text"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                    />
                                    <InputField
                                        id="email"
                                        label="Email Address"
                                        variant="outlined"
                                        name="emailAddress"
                                        size="small"
                                        type="email"
                                        value={formik.values.emailAddress}
                                        onChange={formik.handleChange}
                                    />
                                    <InputField
                                        id="password"
                                        label="Password"
                                        variant="outlined"
                                        name="password"
                                        size="small"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        helperText="Minimum 8 characters, containing alphanumeric and symbolic characters"
                                    />
                                    <PrimaryAction
                                        variant="contained"
                                        color="primary"
                                        size="medium"
                                        onClick={() => formik.submitForm()}>
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

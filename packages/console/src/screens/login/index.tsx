import {
    FunctionComponent,
    ReactElement,
    useCallback,
    useContext,
} from "react";

import { Button, Card, CardContent, Divider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";
import { useGoogleLogin } from "react-google-login";
import { Link, useNavigate } from "react-router-dom";

import { Password, TextField } from "../../components";
import { useNotification, useSession } from "../../hooks";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "calc(100vh - 64px)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    textAlign: "center",

    fontWeight: "bold",
    fontSize: 20,
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontWeight: 400,
    textAlign: "center",
    marginTop: theme.spacing(1),

    fontSize: 12,
}));

const FormContainer = styled("div")(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2),
}));

const InputField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

const PasswordField = styled(Password)(({ theme }) => ({}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
    textTransform: "none",
    width: "100%",
}));

const Links = styled("div")(({ theme }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    padding: `${theme.spacing(2)} 0px ${theme.spacing(2)} 0px`,
}));

const DecoratedLink = styled(Link)(() => ({
    color: "white",
    fontSize: 12,
}));

const DecoratedDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const LOGIN_WITH_GOOGLE = gql`
    mutation LoginWithGoogle($token: String!) {
        loginWithGoogle(token: $token, client: web) {
            jwtToken
            user {
                id
            }
            createdAt
        }
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOGIN_WITH_EMAIL = gql`
    mutation LoginWithEmail($emailAddress: String!, $password: String!) {
        loginWithEmail(emailAddress: $emailAddress, password: $password) {
            jwtToken
            user {
                id
            }
            createdAt
        }
    }
`;

const client = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}/graphql/v1/public`,
    cache: new InMemoryCache(),
});

interface FormValues {
    emailAddress: string;
    password: string;
}

const initialValues: FormValues = {
    emailAddress: "",
    password: "",
};

const validationSchema = yup.object({
    emailAddress: yup
        .string()
        .email("Must be a valid Email")
        .required("Email is required"),
    password: yup.string().required("Password is required"),
});

const Login: FunctionComponent = (): ReactElement => {
    const { reload } = useSession(true);
    const notification = useNotification();

    // const onSuccess = useCallback(
    //     async (response: any) => {
    //         const result = await client.mutate({
    //             mutation: LOGIN_WITH_GOOGLE,
    //             variables: { token: response.code },
    //         });
    //         delete result.data.loginWithGoogle.__typename;
    //         delete result.data.loginWithGoogle.user.__typename;
    //         localStorage.setItem(
    //             "session",
    //             JSON.stringify(result.data.loginWithGoogle),
    //         );
    //         navigate("/apps");
    //     },
    //     [navigate],
    // );

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // const onFailure = () => {};

    // const { signIn } = useGoogleLogin({
    //     onSuccess,
    //     onFailure,
    //     clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || "",
    //     cookiePolicy: "single_host_origin",
    //     // isSignedIn: true,
    //     responseType: "code",
    // });

    // const handleContinueWithGoogle = useCallback(() => {
    //     signIn();
    // }, [signIn]);

    const handleBasicAuthSubmit = useCallback(
        async (values: FormValues) => {
            try {
                const result = await client.mutate({
                    mutation: LOGIN_WITH_EMAIL,
                    variables: { ...values },
                });
                delete result.data.loginWithEmail.__typename;
                delete result.data.loginWithEmail.user.__typename;
                localStorage.setItem(
                    "session",
                    JSON.stringify(result.data.loginWithEmail),
                );
                reload();
            } catch (error: any) {
                notification.notifyError(error);
            }
        },
        [notification, reload],
    );

    return (
        <Root>
            <Card>
                <CardContent>
                    <SectionTitle>Login to continue</SectionTitle>
                    <FormContainer>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleBasicAuthSubmit as any}
                            validationSchema={validationSchema}
                        >
                            {(formik) => (
                                <>
                                    <InputField
                                        id="Email"
                                        label="Email"
                                        variant="outlined"
                                        name="emailAddress"
                                        onChange={formik.handleChange}
                                        size="small"
                                        help=""
                                    />
                                    <div style={{ marginTop: 16 }}>
                                        <PasswordField
                                            id="Password"
                                            label="Password"
                                            variant="outlined"
                                            name="password"
                                            onChange={formik.handleChange}
                                            size="small"
                                            help=""
                                        />
                                    </div>
                                    <PrimaryAction
                                        onClick={() => formik.submitForm()}
                                        variant="contained"
                                        size="medium"
                                    >
                                        Login
                                    </PrimaryAction>
                                </>
                            )}
                        </Formik>
                    </FormContainer>
                    <Links>
                        <DecoratedLink to="/create-account">
                            Create New Account
                        </DecoratedLink>
                    </Links>
                    {/* <DecoratedDivider />
                     <PrimaryAction
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={handleContinueWithGoogle}
                    >
                        Continue with Google
                    </PrimaryAction> */}
                </CardContent>
            </Card>
        </Root>
    );
};

export default Login;

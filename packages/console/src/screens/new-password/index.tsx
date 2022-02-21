import {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";

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

const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontWeight: 400,
    textAlign: "center",
    marginBottom: theme.spacing(2),
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
        width: 264,
    },
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

interface FormValues {
    newPassword: string;
}

const initialValues: FormValues = {
    newPassword: "",
};
const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validationSchema = yup.object().shape({
    password: yup
        .string()
        .min(8)
        .matches(regex, {
            message:
                "Minimum 8 characters, containing alphanumeric and symbolic characters",
            excludeEmptyString: true,
        })
        .required("Password is required"),
});

const COMPLETE_PASSWORD_RESET = gql`
    mutation CompletePasswordReset($token: String!, $newPassword: String!) {
        completePasswordReset(token: $emailAddress, newPassword: $password) {
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

const useQueryParams = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const result: any = {};
    for (const [key, value] of (params as any).entries()) {
        (result as any)[key] = value;
    }
    return result;
};

const NewPassword: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    const [showForm, SetShowForm] = useState(false);
    const { token } = useQueryParams();

    useEffect(() => {
        document.title = "New Password | Hypertool";
        if (token) {
            SetShowForm(true);
        }
    }, []);

    const handleSubmit = useCallback(
        async (values: FormValues) => {
            const result = await client.mutate({
                mutation: COMPLETE_PASSWORD_RESET,
                variables: {
                    token,
                    newPassword: values.newPassword,
                },
            });
            localStorage.setItem(
                "session",
                JSON.stringify(result.data.jwtToken),
            );
            navigate("/organizations/new");
        },
        [navigate],
    );

    return (
        <Root>
            <Card>
                <CardContent>
                    {showForm && (
                        <>
                            <Title>Reset Your Password</Title>
                            <FormContainer>
                                <Formik
                                    initialValues={initialValues}
                                    onSubmit={handleSubmit}
                                    validationSchema={validationSchema}>
                                    {(formik) => (
                                        <>
                                            <InputField
                                                id="newPassword"
                                                label="Enter New Password"
                                                variant="outlined"
                                                name="newPassword"
                                                size="small"
                                                type="password"
                                                value={
                                                    formik.values.newPassword
                                                }
                                                onChange={formik.handleChange}
                                            />
                                            <PrimaryAction
                                                variant="contained"
                                                color="primary"
                                                size="medium"
                                                onClick={() =>
                                                    formik.submitForm()
                                                }>
                                                Submit
                                            </PrimaryAction>
                                        </>
                                    )}
                                </Formik>
                            </FormContainer>
                        </>
                    )}
                    {!showForm && <Title>Invalid Link</Title>}
                </CardContent>
            </Card>
        </Root>
    );
};

export default NewPassword;

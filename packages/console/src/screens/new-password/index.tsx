import {
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Button, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { PublicClient } from "@hypertool/common";

import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router";

import { TextField } from "../../components";
import { useQueryParams } from "../../hooks";

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

const NewPassword: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    const [showForm, SetShowForm] = useState(false);
    const { token } = useQueryParams();

    const appName = "manage-users"; /* Temporary Declaration */
    // const publicClient = useMemo(() => new PublicClient(appName), [appName]);

    useEffect(() => {
        document.title = "New Password | Hypertool";
        if (token) {
            SetShowForm(true);
        }
    }, [token]);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const handleSubmit = () => {};

    /*
     * const handleSubmit = useCallback(
     *     async (values: FormValues) => {
     *         const data = await (publicClient as any).completePasswordReset({
     *             token,
     *             newPassword: values.newPassword,
     *         });
     */

    /*
     *         localStorage.setItem("session", JSON.stringify(data.jwtToken));
     *         navigate("/organizations/new");
     *     },
     *     [navigate, publicClient, token],
     * );
     */

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
                                    validationSchema={validationSchema}
                                >
                                    {(formik) => (
                                        <>
                                            <InputField
                                                id="newPassword"
                                                label="Enter New Password"
                                                variant="outlined"
                                                name="newPassword"
                                                size="small"
                                                onChange={formik.handleChange}
                                                help=""
                                            />
                                            <PrimaryAction
                                                variant="contained"
                                                color="primary"
                                                size="medium"
                                                onClick={() =>
                                                    formik.submitForm()
                                                }
                                            >
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

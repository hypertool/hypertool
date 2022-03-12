import { FunctionComponent, ReactElement, useCallback, useEffect } from "react";

import { Button, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router";

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

const FormContainer = styled("div")(() => ({
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
    oldPassword: string;
    newPassword1: string;
    newPassword2: string;
}

const initialValues: FormValues = {
    oldPassword: "",
    newPassword1: "",
    newPassword2: "",
};
const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validationSchema = yup.object().shape({
    oldPassword: yup
        .string()
        .min(8)
        .matches(regex, {
            message:
                "Minimum 8 characters, containing alphanumeric and symbolic characters",
            excludeEmptyString: true,
        })
        .required("Password is required"),
    newPassword1: yup
        .string()
        .min(8)
        .matches(regex, {
            message:
                "Minimum 8 characters, containing alphanumeric and symbolic characters",
            excludeEmptyString: true,
        })
        .required("Password is required"),
    newPassword2: yup
        .string()
        .min(8)
        .matches(regex, {
            message:
                "Minimum 8 characters, containing alphanumeric and symbolic characters",
            excludeEmptyString: true,
        })
        .required("Password is required"),
});

const UpdatePassword: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Update Password | Hypertool";
    }, []);
    /* Temporary Declaration */
    // const client = new Client();

    const handleSubmit = useCallback(
        async (values: FormValues) => {
            if (values.newPassword1 === values.newPassword2) {
                /*
                 * client.updatePassword({
                 *     oldPassword: values.oldPassword,
                 *     newPassword: values.newPassword1,
                 * });
                 */
                navigate("/organizations/new");
            }
        },
        [navigate],
    );

    return (
        <Root>
            <Card>
                <CardContent>
                    <Title>Update Your Password</Title>
                    <FormContainer>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >
                            {(formik) => (
                                <>
                                    <InputField
                                        id="oldPassword"
                                        label="Enter Old Password"
                                        variant="outlined"
                                        name="oldPassword"
                                        size="small"
                                        onChange={formik.handleChange}
                                        help=""
                                    />
                                    <InputField
                                        id="newPassword1"
                                        label="Enter New Password"
                                        variant="outlined"
                                        name="newPassword1"
                                        size="small"
                                        onChange={formik.handleChange}
                                        help=""
                                    />
                                    <InputField
                                        id="newPassword2"
                                        label="Again Enter New Password"
                                        variant="outlined"
                                        name="newPassword2"
                                        size="small"
                                        onChange={formik.handleChange}
                                        help=""
                                    />
                                    <PrimaryAction
                                        variant="contained"
                                        color="primary"
                                        size="medium"
                                        onClick={() => formik.submitForm()}
                                    >
                                        Submit
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

export default UpdatePassword;

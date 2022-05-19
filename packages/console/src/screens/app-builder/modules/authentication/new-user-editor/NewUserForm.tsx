import { FunctionComponent, ReactElement, useMemo } from "react";
import { useCallback } from "react";

import {
    Button,
    CircularProgress,
    Divider,
    Icon,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";

import { Password, TextField } from "../../../../../components";
import {
    useBuilderActions,
    useNotification,
    useParam,
    useTab,
} from "../../../../../hooks";

const Root = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    padding: theme.spacing(4),
}));

const Left = styled("div")(({ theme }) => ({
    maxWidth: 280,
    marginRight: theme.spacing(4),
}));

const Right = styled("div")({
    width: "100%",
});

const Title = styled(Typography)(({ theme }) => ({
    fontSize: 20,
    fontWeight: 500,
    color: theme.palette.getContrastText(theme.palette.background.default),
}));

const Help = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    color: theme.palette.getContrastText(theme.palette.background.default),
    lineHeight: 1.5,
    marginTop: theme.spacing(1),
})) as any;

const ActionContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: theme.spacing(3),
    maxWidth: 400,
}));

const CreateAction = styled(Button)({
    width: 184,
});

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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

interface IFormValues {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
}

const initialValues: IFormValues = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
};

const validationSchema = yup.object({
    firstName: yup
        .string()
        .max(30, "First name should be 30 characters or less")
        .required("First name is required"),
    lastName: yup
        .string()
        .max(30, "Last name should be 30 characters or less")
        .required("Last name is required"),
    emailAddress: yup
        .string()
        .max(255, "Email address should be 255 characters or less")
        .required("Email address is required"),
    password: yup
        .string()
        .min(8, "Password should be 8 characters or more")
        .max(128, "Password should be 128 characters or less")
        .required("Password is required"),
});

const CREATE_USER = gql`
    mutation CreateUser(
        $firstName: String!
        $lastName: String!
        $emailAddress: String!
        $app: ID!
    ) {
        createUser(
            firstName: $firstName
            lastName: $lastName
            emailAddress: $emailAddress
            app: $app
        ) {
            id
        }
    }
`;

const NewUserForm: FunctionComponent = (): ReactElement => {
    const [createUser, { loading: creatingController }] = useMutation(
        CREATE_USER,
        { refetchQueries: ["GetUsers"] },
    );
    const notification = useNotification();

    const { replaceTab } = useBuilderActions();
    const { index } = useTab();
    const appId = useParam("appId");

    const userId = useMemo(() => {
        const json = localStorage.getItem("session");
        if (!json) {
            throw new Error(
                "Session not found! This screen should be rendered only when the user is logged in.",
            );
        }

        const session = JSON.parse(json);
        return session.user.id;
    }, []);

    const handleSubmit = useCallback(
        async (values: IFormValues) => {
            try {
                notification.notify({
                    type: "info",
                    message: `Creating user "${values.emailAddress}"...`,
                    closeable: false,
                    autoCloseDuration: -1,
                });

                const result = await createUser({
                    variables: {
                        ...values,
                        app: appId,
                    },
                });

                notification.notifySuccess(
                    `Created user "${values.emailAddress}" successfully`,
                );

                replaceTab(index, "authentication.edit-user", {
                    userId: result.data.createUser.id,
                });
            } catch (error: any) {
                notification.notifyError(error);
            }
        },
        [replaceTab, index, userId, appId, notification],
    );

    const creatingUser = false;

    return (
        <Root>
            <Left>
                <Title variant="h1">Create new user</Title>
                <Help component="p" variant="caption">
                    A user represents a person that can interact with your
                    application.
                </Help>
            </Left>

            <Divider orientation="vertical" flexItem={true} sx={{ mr: 4 }} />

            <Right>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {(formik) => (
                        <>
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
                                        onChange={formik.handleChange}
                                        size="small"
                                        help=""
                                        fullWidth={true}
                                        required={true}
                                    />
                                </PasswordTextField>
                            </FormRoot>
                            <ActionContainer>
                                <CreateAction
                                    onClick={() => formik.submitForm()}
                                    variant="contained"
                                    size="small"
                                    disabled={false}
                                >
                                    Create User
                                    {!creatingUser && (
                                        <Icon fontSize="small" sx={{ ml: 1 }}>
                                            check_circle_outline
                                        </Icon>
                                    )}
                                    {creatingUser && (
                                        <CircularProgress
                                            size="14px"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </CreateAction>
                            </ActionContainer>
                        </>
                    )}
                </Formik>
            </Right>
        </Root>
    );
};

export default NewUserForm;

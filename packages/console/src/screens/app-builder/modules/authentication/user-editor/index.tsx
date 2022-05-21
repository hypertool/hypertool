import { FunctionComponent, ReactElement, useMemo } from "react";
import { useCallback } from "react";

import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Divider,
    Icon,
    Toolbar,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";
import isEqual from "shallowequal";

import { TextField } from "../../../../../components";
import {
    useBuilderActions,
    useNotification,
    useParam,
    useTab,
    useTabBundle,
    useUpdateTabTitle,
} from "../../../../../hooks";
import { IEditUserBundle } from "../../../../../types";

const Title = styled(Typography)(() => ({}));

const WorkspaceToolbar = styled(Toolbar)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}));

const ActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
}));

const ActionIcon = styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const Root = styled("div")(({ theme }) => ({
    width: "100%",
}));

const ProgressContainer = styled("div")(() => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: "calc(100vh - 104px)",
    justifyContent: "center",
    alignItems: "center",
}));

const Content = styled(Container)(({ theme }) => ({
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
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
    color: theme.palette.getContrastText(theme.palette.background.default),
}));

const Right = styled("div")({
    width: "100%",
});

const Help = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    color: theme.palette.getContrastText(theme.palette.background.default),
    lineHeight: 1.5,
})) as any;

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
}));

const IdentifierTextField = styled(TextField)({
    maxWidth: 400,
});

const FirstNameTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
}));

const LastNameTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(2),
    maxWidth: 400,
}));

const EmailAddressTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(2),
    maxWidth: 400,
}));

interface IFormValues {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

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
});

const GET_USER = gql`
    query GetUser($userId: ID!) {
        getUserById(userId: $userId) {
            id
            firstName
            lastName
            emailAddress
        }
    }
`;

const UPDATE_USER = gql`
    mutation UpdateUser($userId: ID!, $firstName: String, $lastName: String) {
        updateUser(
            userId: $userId
            firstName: $firstName
            lastName: $lastName
        ) {
            id
        }
    }
`;

const UPDATE_EMAIL_ADDRESS = gql`
    mutation UpdateEmailAddress($userId: ID!, $emailAddress: String!) {
        updateEmailAddress(userId: $userId, emailAddress: $emailAddress) {
            id
        }
    }
`;

const UserEditor: FunctionComponent = (): ReactElement => {
    const { userId } = useTabBundle<IEditUserBundle>();

    const { loading, data, refetch } = useQuery(GET_USER, {
        variables: {
            userId,
        },
        notifyOnNetworkStatusChange: true,
    });
    const { id, firstName, lastName, emailAddress } = data?.getUserById ?? {
        id: "",
        firstName: "",
        lastName: "",
        emailAddress: "",
    };

    useUpdateTabTitle(emailAddress || undefined);

    const [updateUser] = useMutation(UPDATE_USER, {
        refetchQueries: ["GetUsers"],
    });
    const [updateEmailAddress] = useMutation(UPDATE_EMAIL_ADDRESS, {
        refetchQueries: ["GetUsers"],
    });

    const notification = useNotification();
    const { replaceTab } = useBuilderActions();
    const { index } = useTab();
    const appId = useParam("appId");

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleSubmit = useCallback(
        async (values: IFormValues) => {
            try {
                const {
                    id,
                    emailAddress: newEmailAddress,
                    ...otherValues
                } = values;
                if (
                    !isEqual(otherValues, { firstName, lastName, emailAddress })
                ) {
                    notification.notify({
                        type: "info",
                        message: `Updating user "${values.emailAddress}"...`,
                        closeable: false,
                        autoCloseDuration: -1,
                    });

                    await updateUser({
                        variables: {
                            ...otherValues,
                            userId,
                        },
                    });

                    notification.notifySuccess(
                        `Updated user "${values.emailAddress}" successfully`,
                    );
                }

                if (newEmailAddress !== emailAddress) {
                    notification.notify({
                        type: "info",
                        message: `Updating email address to "${values.emailAddress}"...`,
                        closeable: false,
                        autoCloseDuration: -1,
                    });

                    await updateEmailAddress({
                        variables: { emailAddress: newEmailAddress, userId },
                    });

                    notification.notifySuccess(
                        `Updated email address to "${values.emailAddress}" successfully`,
                    );
                }
            } catch (error: any) {
                notification.notifyError(error);
            }
        },
        [
            replaceTab,
            index,
            userId,
            appId,
            notification,
            firstName,
            lastName,
            emailAddress,
            updateEmailAddress,
            updateUser,
        ],
    );

    const renderProgress = () => (
        <ProgressContainer>
            <CircularProgress size="28px" />
        </ProgressContainer>
    );

    return (
        <Formik
            initialValues={{
                id,
                firstName,
                lastName,
                emailAddress,
            }}
            enableReinitialize={true}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
            {(formik) => (
                <Root>
                    <AppBar position="static" elevation={1}>
                        <WorkspaceToolbar>
                            <Title>Edit User</Title>
                            <ActionContainer>
                                {/* <Button
                                size="small"
                                color="inherit"
                                onClick={handleCreateNew}
                                sx={{ mr: 2 }}
                                disabled={loading}>
                                <ActionIcon fontSize="small">
                                    delete
                                </ActionIcon>
                                Delete
                            </Button> */}
                                <Button
                                    size="small"
                                    onClick={handleRefresh}
                                    color="inherit"
                                    sx={{ mr: 2 }}
                                    disabled={loading}
                                >
                                    <ActionIcon fontSize="small">
                                        refresh
                                    </ActionIcon>
                                    Refresh
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => formik.submitForm()}
                                    color="inherit"
                                    disabled={loading}
                                >
                                    <ActionIcon fontSize="small">
                                        save
                                    </ActionIcon>
                                    Save
                                </Button>
                            </ActionContainer>
                        </WorkspaceToolbar>
                    </AppBar>

                    {loading && renderProgress()}

                    {!loading && (
                        <Content>
                            <Left>
                                <Icon fontSize="medium">info</Icon>
                                <Help component="p" variant="caption">
                                    A user represents a person that can interact
                                    with your application.
                                </Help>
                            </Left>

                            <Divider
                                orientation="vertical"
                                flexItem={true}
                                sx={{ mr: 4 }}
                            />

                            <Right>
                                <FormRoot>
                                    <IdentifierTextField
                                        name="id"
                                        id="id"
                                        label="Identifier"
                                        size="small"
                                        variant="outlined"
                                        fullWidth={true}
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                    />

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
                                </FormRoot>
                            </Right>
                        </Content>
                    )}
                </Root>
            )}
        </Formik>
    );
};

export default UserEditor;

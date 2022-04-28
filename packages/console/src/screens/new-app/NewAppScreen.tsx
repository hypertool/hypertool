import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect } from "react";

import {
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

import { gql, useMutation, useQuery } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router";

import { Select, TextField } from "../../components";
import { useNotification, usePrivateSession } from "../../hooks";

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

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

const NameTextField = styled(TextField)({
    maxWidth: 400,
});

const TitleTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
}));

const OrganizationSelect = styled("div")(({ theme }) => ({
    width: 400,
    marginTop: theme.spacing(2),
}));

const Warning = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(0, 2),
    fontSize: 12,
}));

const ProgressContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
}));

const ProgressText = styled(Typography)(({ theme }) => ({
    fontSize: 12,
    marginRight: theme.spacing(1),
}));

const OrganizationContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
}));

const OrganizationTitle = styled(Typography)(({ theme }) => ({
    fontSize: 14,
}));

const NoneOrganizationTitle = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontStyle: "italic",
}));

const OrganizationName = styled(Typography)(({ theme }) => ({
    fontSize: 12,
}));

const DescriptionTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
}));

const ActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
}));

const CreateAction = styled(Button)(({ theme }) => ({
    // width: 156,
    padding: theme.spacing(0.5, 3),
}));

interface FormValues {
    name: string;
    description: string;
}

const initialValues: FormValues = {
    name: "",
    description: "",
};

const validationSchema = yup.object({
    name: yup
        .string()
        .max(128, "Name should be 128 characters or less")
        .required("Name is required"),
    title: yup
        .string()
        .max(256, "Title should be 128 characters or less")
        .required("Title is required"),
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
});

const CREATE_APP = gql`
    mutation CreateApp(
        $name: String!
        $title: String!
        $description: String!
        $organization: ID
    ) {
        createApp(
            name: $name
            title: $title
            organization: $organization
            description: $description
        ) {
            id
        }
    }
`;

const GET_USER_ORGANIZATIONS = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            organizations {
                id
                title
                name
            }
        }
    }
`;

const NewAppScreen: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    const { user } = usePrivateSession();
    const notification = useNotification();

    const [createApp, { loading, data }] = useMutation(CREATE_APP, {
        refetchQueries: ["GetApps"],
    });

    const { loading: loadOrganizations, data: organizationsData } = useQuery(
        GET_USER_ORGANIZATIONS,
        {
            variables: {
                userId: user.id,
            },
            notifyOnNetworkStatusChange: true,
        },
    );
    const organizations = organizationsData?.getUserById?.organizations ?? [];

    const handleSubmit = useCallback(
        async (values: FormValues) => {
            try {
                notification.notify({
                    type: "info",
                    message: `Creating screen "${values.name}"...`,
                    closeable: false,
                    autoCloseDuration: -1,
                });

                await createApp({
                    variables: {
                        ...values,
                    },
                });

                notification.notifySuccess(
                    `Created screen "${values.name}" successfully`,
                );
            } catch (error: any) {
                notification.notifyError(error);
            }
        },
        [createApp, notification],
    );

    useEffect(() => {
        if (!loading && data?.createApp) {
            navigate("/apps");
        }
    }, [loading, data, navigate]);

    const renderOrganizationValue = useCallback(
        (organizationId) => {
            if (organizationId === "") {
                return <OrganizationName>None</OrganizationName>;
            }

            const organization = organizations.find(
                (organization: any) => organization.id === organizationId,
            );
            return <OrganizationName>{organization.name}</OrganizationName>;
        },
        [organizations],
    );

    const renderOrganizationMenuItems = useCallback(() => {
        if (loadOrganizations) {
            return (
                <ProgressContainer>
                    <ProgressText>Loading...</ProgressText>
                    <CircularProgress size="12px" />
                </ProgressContainer>
            );
        }

        if (organizations.length === 0) {
            return <Warning>You do not belong to any organizations.</Warning>;
        }

        return [
            ...organizations.map((organization: any) => (
                <MenuItem key={organization.id} value={organization.id}>
                    <OrganizationContainer>
                        <OrganizationTitle>
                            {organization.title}
                        </OrganizationTitle>
                        <OrganizationName>{organization.name}</OrganizationName>
                    </OrganizationContainer>
                </MenuItem>
            )),
            <MenuItem key="none" value="">
                <OrganizationContainer>
                    <NoneOrganizationTitle>None</NoneOrganizationTitle>
                </OrganizationContainer>
            </MenuItem>,
        ];
    }, [loadOrganizations, organizations]);

    return (
        <Root>
            <Left>
                <Title variant="h1">Create new app</Title>
                <Help component="p" variant="caption">
                    An app provides an interface for the user to interact with
                    your platform on Android, iOS, and web.
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
                                <NameTextField
                                    required={true}
                                    name="name"
                                    id="name"
                                    label="Name"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                    help={
                                        (formik.values.name &&
                                            `Your app will be hosted at ${formik.values.name}.hypertool.io`) ||
                                        ""
                                    }
                                />
                                <TitleTextField
                                    required={true}
                                    name="title"
                                    id="title"
                                    label="Title"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                    help=""
                                />
                                {/* <OrganizationSelect>
                                    <Select
                                        id="organization"
                                        name="organization"
                                        label="Organization"
                                        variant="outlined"
                                        size="small"
                                        help=""
                                        renderMenuItems={
                                            renderOrganizationMenuItems as any
                                        }
                                        renderValue={renderOrganizationValue}
                                    />
                                </OrganizationSelect> */}
                                <DescriptionTextField
                                    name="description"
                                    id="description"
                                    label="Description"
                                    size="small"
                                    variant="outlined"
                                    multiline={true}
                                    rows={5}
                                    fullWidth={true}
                                />
                            </FormRoot>

                            <ActionContainer>
                                <CreateAction
                                    onClick={formik.submitForm}
                                    variant="contained"
                                    size="small"
                                    disabled={loading}
                                >
                                    Create App
                                    {!loading && (
                                        <CheckCircleOutline
                                            fontSize="small"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                    {loading && (
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

export default NewAppScreen;

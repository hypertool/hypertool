import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect } from "react";

import {
    Button,
    CircularProgress,
    Container,
    Divider,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

import { gql, useMutation } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router";

import { TextField } from "../../components";

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

const TextFieldHelp = styled(Typography)({
    display: "flex",
    marginTop: 4,
    flexDirection: "column",
    marginLeft: -8,
    marginBottom: 0,
    paddingBottom: 0,
});

const NameTextField = styled(TextField)({
    maxWidth: 400,
});

const TitleTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
}));

const OrganizationTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
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
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
});

const CREATE_APP = gql`
    mutation CreateApp(
        $name: String!
        $title: String!
        $organization: String!
        $description: String!
        $slug: String!
    ) {
        createApp(
            name: $name
            title: $title
            organization: $organization
            description: $description
            slug: $slug
        ) {
            id
        }
    }
`;

const NewAppScreen: FunctionComponent = (): ReactElement => {
    const [createApp, { loading, data }] = useMutation(CREATE_APP, {
        refetchQueries: ["GetApps"],
    });

    const theme = useTheme();
    const navigate = useNavigate();
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
    const session = localStorage.getItem("session") as string;

    const handleSubmit = useCallback(
        (values: FormValues): any => {
            if (session) {
                createApp({
                    variables: {
                        ...values,
                        creator: {
                            user: JSON.parse(session)?.user?.id,
                            role: "owner",
                        },
                    },
                });
            }
        },
        [createApp, session],
    );

    useEffect(() => {
        if (!loading && data?.createApp) {
            navigate("/apps");
        }
    }, [loading, data, navigate]);

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
                                <OrganizationTextField
                                    required={true}
                                    name="organization"
                                    id="organization"
                                    label="Organization"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                    help=""
                                />
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

import type { FunctionComponent, ReactElement } from "react";
import { useCallback } from "react";

import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircle from "@mui/icons-material/CheckCircle";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

import { gql, useMutation } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";
import { useParams } from "react-router-dom";

import { TextField } from "../../components";
import { useNotification, useReplaceTab } from "../../hooks";
import { slugPattern } from "../../utils/constants";

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

const ActionContainer = styled("div")({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
});

const CreateAction = styled(Button)(({ theme }) => ({
    padding: theme.spacing(0.5, 3),
}));

const NameTextField = styled(TextField)({
    maxWidth: 400,
}) as any;

const TitleTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
})) as any;

const SlugTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
})) as any;

const DescriptionTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(2),
})) as any;

const TextFieldHelp = styled(Typography)({
    display: "flex",
    marginTop: 4,
    flexDirection: "column",
    marginLeft: -8,
    marginBottom: 0,
    paddingBottom: 0,
});

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

interface IFormValues {
    name: string;
    title: string;
    slug: string;
    description: string;
}

const initialValues: IFormValues = {
    name: "",
    title: "",
    slug: "",
    description: "",
};

const validationSchema = yup.object({
    name: yup
        .string()
        .max(256, "Screen name should be 256 characters or less")
        .required(),
    title: yup
        .string()
        .max(256, "Title should be 256 characters or less")
        .required(),
    slug: yup.string().matches(slugPattern, "Slug should be valid").required(),
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
});

const CREATE_SCREEN = gql`
    mutation CreateScreen(
        $app: ID!
        $name: String!
        $title: String!
        $slug: String
        $content: String!
        $description: String!
    ) {
        createScreen(
            app: $app
            name: $name
            title: $title
            slug: $slug
            content: $content
            description: $description
        ) {
            id
        }
    }
`;

const NewScreenForm: FunctionComponent = (): ReactElement => {
    // TODO: Destructure `error`, check for non-null, send to Sentry
    const [createScreen, { loading: creatingScreen, data: newScreen }] =
        useMutation(CREATE_SCREEN, {
            refetchQueries: ["GetControllers", "GetScreens"],
        });
    const { appId } = useParams();
    const notification = useNotification();

    useReplaceTab(Boolean(newScreen), "edit-screen", {
        screenId: newScreen?.createScreen.id,
    });

    const handleSubmit = useCallback(async (values: IFormValues) => {
        try {
            notification.notify({
                type: "info",
                message: `Creating screen "${values.name}"...`,
                closeable: false,
                autoCloseDuration: -1,
            });

            await createScreen({
                variables: {
                    ...values,
                    content: "",
                    app: appId,
                },
            });

            notification.notifySuccess(
                `Created screen "${values.name}" successfully`,
            );
        } catch (error: any) {
            notification.notifyError(error);
        }
    }, []);

    return (
        <Root>
            <Left>
                <Title variant="h1">Create new screen</Title>
                <Help component="p" variant="caption">
                    A screen provides an interface for the user to interact with
                    the app.
                </Help>
            </Left>

            <Divider orientation="vertical" flexItem={true} sx={{ mr: 4 }} />

            <Right>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit as any}
                    validationSchema={validationSchema}
                >
                    {(formik) => (
                        <>
                            <FormRoot>
                                <NameTextField
                                    name="name"
                                    required={true}
                                    id="name"
                                    label="Name"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                    helperText={
                                        <TextFieldHelp variant="caption">
                                            The screen name will help you
                                            identify the screen across your
                                            Hypertool app, including code.
                                        </TextFieldHelp>
                                    }
                                />

                                <TitleTextField
                                    name="title"
                                    required={true}
                                    id="title"
                                    label="Title"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                />

                                <SlugTextField
                                    name="slug"
                                    required={true}
                                    id="slug"
                                    label="Slug"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                />

                                <DescriptionTextField
                                    name="description"
                                    id="description"
                                    label="Description"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                    multiline={true}
                                    rows={4}
                                />
                            </FormRoot>
                            <ActionContainer>
                                <CreateAction
                                    onClick={() => formik.submitForm()}
                                    variant="contained"
                                    size="small"
                                    disabled={false}
                                >
                                    Create Screen
                                    {!creatingScreen && !newScreen && (
                                        <CheckCircleOutline
                                            fontSize="small"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                    {!creatingScreen && newScreen && (
                                        <CheckCircle
                                            fontSize="small"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                    {creatingScreen && (
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

export default NewScreenForm;

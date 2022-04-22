import { FunctionComponent, ReactElement, useMemo } from "react";
import { useCallback, useEffect } from "react";

import {
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircle from "@mui/icons-material/CheckCircle";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

import { gql, useMutation } from "@apollo/client";

import * as yup from "yup";
import { createTwoFilesPatch } from "diff";
import { Formik } from "formik";

import { Select, TextField } from "../../components";
import { useBuilderActions, useParam, useTab } from "../../hooks";
import { templates } from "../../utils";
import { controllerLanguages } from "../../utils/constants";

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

const CreateAction = styled(Button)({
    width: 184,
});

const ControllerNameTextField = styled(TextField)({
    maxWidth: 400,
}) as any;

const ControllerTitleTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
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

const LanguageSelect = styled("div")(({ theme }) => ({
    width: 400,
    marginTop: theme.spacing(3),
}));

const CREATE_CONTROLLER = gql`
    mutation CreateController(
        $name: String!
        $description: String!
        $language: ControllerLanguage!
        $patches: [ControllerPatchInput!]!
        $app: ID!
    ) {
        createController(
            name: $name
            description: $description
            language: $language
            patches: $patches
            app: $app
        ) {
            id
        }
    }
`;

interface IFormValues {
    name: string;
    description: string;
    language: string;
}

const initialValues: IFormValues = {
    name: "",
    description: "",
    language: "javascript",
};

const labelByLanguage: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
};

const validationSchema = yup.object({
    name: yup
        .string()
        .max(256, "Controller name should be 256 characters or less")
        .required(),
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
    language: yup.string().oneOf(controllerLanguages).required(),
});

const NewControllerForm: FunctionComponent = (): ReactElement => {
    // TODO: Destructure `error`, check for non-null, send to Sentry
    const [
        createController,
        { loading: creatingController, data: newController },
    ] = useMutation(CREATE_CONTROLLER, { refetchQueries: ["GetControllers"] });

    const { replaceTab } = useBuilderActions();
    const { index } = useTab();
    const appId = useParam("appId");

    useEffect(() => {
        if (newController) {
            replaceTab(index, "edit-controller", {
                controllerId: newController.createController.id,
            });
        }
    }, [index, newController, replaceTab]);

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

    const handleSubmit = useCallback((values: IFormValues) => {
        createController({
            variables: {
                ...values,
                patches: [
                    {
                        author: userId,
                        content: createTwoFilesPatch(
                            `a/${values.name}`,
                            `b/${values.name}`,
                            "",
                            templates.CONTROLLER_TEMPLATE,
                            "",
                            "",
                        ),
                    },
                ],
                app: appId,
            },
        });
    }, []);

    return (
        <Root>
            <Left>
                <Title variant="h1">Create new controller</Title>
                <Help component="p" variant="caption">
                    A controller allows an app to define custom business logic
                    using JavaScript.
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
                                <ControllerNameTextField
                                    name="name"
                                    required={true}
                                    id="name"
                                    label="Name"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                    helperText={
                                        <TextFieldHelp variant="caption">
                                            The controller name will help you
                                            identify the controller across your
                                            Hypertool app, including code.
                                        </TextFieldHelp>
                                    }
                                />

                                <ControllerTitleTextField
                                    name="description"
                                    id="description"
                                    label="Description"
                                    size="small"
                                    variant="outlined"
                                    fullWidth={true}
                                    multiline={true}
                                    rows={4}
                                />

                                <LanguageSelect>
                                    <Select
                                        id="language"
                                        name="language"
                                        label="Language"
                                        variant="outlined"
                                        size="small"
                                        help=""
                                        renderMenuItems={() =>
                                            controllerLanguages.map(
                                                (controllerLanguage) => (
                                                    <MenuItem
                                                        key={controllerLanguage}
                                                        value={
                                                            controllerLanguage
                                                        }
                                                    >
                                                        {
                                                            labelByLanguage[
                                                                controllerLanguage
                                                            ]
                                                        }
                                                    </MenuItem>
                                                ),
                                            )
                                        }
                                    />
                                </LanguageSelect>
                            </FormRoot>
                            <ActionContainer>
                                <CreateAction
                                    onClick={() => formik.submitForm()}
                                    variant="contained"
                                    size="small"
                                    disabled={false}
                                >
                                    Create Controller
                                    {!creatingController && !newController && (
                                        <CheckCircleOutline
                                            fontSize="small"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                    {!creatingController && newController && (
                                        <CheckCircle
                                            fontSize="small"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                    {creatingController && (
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

export default NewControllerForm;

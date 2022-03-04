import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    Button,
    CircularProgress,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircle from "@mui/icons-material/CheckCircle";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

import * as yup from "yup";
import { Formik } from "formik";

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

const Right = styled("div")(({ theme }) => ({
    width: "100%",
}));

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
    justifyContent: "space-between",
}));

const CreateAction = styled(Button)(({ theme }) => ({
    width: 184,
}));

const ControllerNameTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
})) as any;

const ControllerTitleTextField = styled(TextField)(({ theme }) => ({
    maxWidth: 400,
    marginTop: theme.spacing(3),
})) as any;

const TextFieldHelp = styled(Typography)(({ theme }) => ({
    display: "flex",
    marginTop: 4,
    flexDirection: "column",
    marginLeft: -8,
    marginBottom: 0,
    paddingBottom: 0,
}));

const LanguageFormControl = styled(FormControl)(({ theme }) => ({
    marginTop: theme.spacing(3),
    maxWidth: 400,
}));

const FormRoot = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

interface InitialValues {
    name: string;
    resource: null | string;
}

const initialValues: InitialValues = {
    name: "",
    resource: null,
};

const validationSchema = yup.object({
    name: yup
        .string()
        .max(256, "Controller name should be 256 characters or less")
        .required(),
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
    language: yup.string().required(),
});

const languages = ["javascript", "typescript"];

const NewControllerForm: FunctionComponent = (): ReactElement => {
    const [language, setLanguage] = useState("javascript");

    const handleSubmit = useCallback((values: any) => {}, []);

    const handleLanguageChange = useCallback((event: SelectChangeEvent) => {
        setLanguage(event.target.value);
    }, []);

    const creatingController = false,
        newController = false;

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
                                <LanguageFormControl fullWidth={true}>
                                    <InputLabel id="language-label">
                                        Language
                                    </InputLabel>
                                    <Select
                                        labelId="language-label"
                                        id="language"
                                        value={language}
                                        label="Language"
                                        onChange={handleLanguageChange}
                                        variant="outlined"
                                        size="small"
                                    >
                                        {languages.map((organization) => (
                                            <MenuItem value={organization}>
                                                {organization}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </LanguageFormControl>
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

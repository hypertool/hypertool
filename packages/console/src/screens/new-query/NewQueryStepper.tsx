import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    Button,
    CircularProgress,
    Divider,
    Hidden,
    MobileStepper,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
    useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import CheckCircle from "@mui/icons-material/CheckCircle";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import * as yup from "yup";
import { Formik } from "formik";

import ConfigureStep from "./ConfigureStep";
import OperationStep from "./OperationStep";

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

const StepContainer = styled("div")(({ theme }) => ({
    height: "calc(100vh - 232px)",
    width: "100%",
    padding: theme.spacing(1),
}));

const ActionContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
}));

const LeftActionContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
}));

const StepperAction = styled(Button)(({ theme }) => ({
    width: 120,
}));

const CreateAction = styled(Button)(({ theme }) => ({
    width: 184,
}));

interface StepStructure {
    title: string;
    optional: boolean;
    component: FunctionComponent<any>;
}

const steps: StepStructure[] = [
    {
        title: "Configure query details",
        optional: false,
        component: ConfigureStep,
    },
    {
        title: "Write query operation",
        optional: false,
        component: OperationStep,
    },
];

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
        .max(256, "Query name should be 256 characters or less")
        .required(),
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
    resource: yup.string().required(),
});

const NewResourceStepper: FunctionComponent = (): ReactElement => {
    const [activeStep, setActiveStep] = useState(0);
    const theme = useTheme();

    const handleSubmit = useCallback((values: any) => {}, []);

    const handleNext = () => {
        if (activeStep + 1 === steps.length) {
            return;
        }

        setActiveStep((previousActiveStep) => previousActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const isStepComplete = (step: number) => {
        switch (step) {
            case 0:
                return false;

            case 1:
                return false;

            default:
                throw new Error("Invalid step number");
        }
    };

    const renderStepperItem = (step: StepStructure, index: number) => {
        return (
            <Step key={step.title} completed={isStepComplete(index)}>
                <StepLabel
                    optional={
                        step.optional && (
                            <Typography variant="caption">Optional</Typography>
                        )
                    }
                >
                    {step.title}
                </StepLabel>
            </Step>
        );
    };

    const renderStepperItems = () => steps.map(renderStepperItem);

    const creatingQuery = false,
        newQuery = false;

    return (
        <Root>
            <Left>
                <Title variant="h1">Create new query</Title>
                <Help component="p" variant="caption">
                    A query allows the client to execute commands against a
                    resource. For example, you could write a query to fetch all
                    the users from a MySQL table.
                </Help>
            </Left>

            <Divider orientation="vertical" flexItem={true} sx={{ mr: 4 }} />

            <Right>
                <Hidden lgDown={true}>
                    <Stepper activeStep={activeStep}>
                        {renderStepperItems()}
                    </Stepper>
                </Hidden>
                <Hidden lgUp={true}>
                    <Paper
                        square={true}
                        elevation={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            height: 50,
                            p: 2,
                            backgroundColor: "#000000",
                        }}
                    >
                        <Typography>{steps[activeStep].title}</Typography>
                    </Paper>
                </Hidden>

                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {(formik) => (
                        <>
                            <StepContainer>
                                {activeStep === 0 && <ConfigureStep />}
                                {activeStep === 1 && <OperationStep />}
                            </StepContainer>

                            <Hidden lgDown={true}>
                                <ActionContainer>
                                    <LeftActionContainer>
                                        {activeStep > 0 && (
                                            <StepperAction
                                                color="inherit"
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{ mr: 1 }}
                                                variant="contained"
                                                size="small"
                                            >
                                                {theme.direction === "rtl" ? (
                                                    <KeyboardArrowRight />
                                                ) : (
                                                    <KeyboardArrowLeft />
                                                )}
                                                Back
                                            </StepperAction>
                                        )}
                                    </LeftActionContainer>

                                    {activeStep < steps.length - 1 && (
                                        <StepperAction
                                            onClick={handleNext}
                                            variant="contained"
                                            size="small"
                                            disabled={false}
                                        >
                                            Next
                                            {theme.direction === "rtl" ? (
                                                <KeyboardArrowLeft />
                                            ) : (
                                                <KeyboardArrowRight />
                                            )}
                                        </StepperAction>
                                    )}

                                    {activeStep + 1 === steps.length && (
                                        <CreateAction
                                            onClick={() => formik.submitForm()}
                                            variant="contained"
                                            size="small"
                                            disabled={
                                                activeStep === 0 ||
                                                (activeStep === 1 &&
                                                    (!formik.dirty ||
                                                        !formik.isValid)) ||
                                                creatingQuery
                                            }
                                        >
                                            Create Query
                                            {!creatingQuery && !newQuery && (
                                                <CheckCircleOutline
                                                    fontSize="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                            {!creatingQuery && newQuery && (
                                                <CheckCircle
                                                    fontSize="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                            {creatingQuery && (
                                                <CircularProgress
                                                    size="14px"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </CreateAction>
                                    )}
                                </ActionContainer>
                            </Hidden>

                            <Hidden lgUp={true}>
                                <Paper
                                    square
                                    elevation={1}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: 50,
                                        bgcolor: "background.default",
                                        padding: 0,
                                    }}
                                >
                                    <MobileStepper
                                        variant="text"
                                        steps={steps.length}
                                        position="static"
                                        activeStep={activeStep}
                                        sx={{
                                            width: "100%",
                                            backgroundColor:
                                                theme.palette.background.paper,
                                            // marginTop: theme.spacing(11)
                                        }}
                                        nextButton={
                                            <Button
                                                size="small"
                                                onClick={handleNext}
                                                disabled={
                                                    activeStep ===
                                                    steps.length - 1
                                                }
                                            >
                                                Next
                                                {theme.direction === "rtl" ? (
                                                    <KeyboardArrowLeft />
                                                ) : (
                                                    <KeyboardArrowRight />
                                                )}
                                            </Button>
                                        }
                                        backButton={
                                            <Button
                                                size="small"
                                                onClick={handleBack}
                                                disabled={activeStep === 0}
                                            >
                                                {theme.direction === "rtl" ? (
                                                    <KeyboardArrowRight />
                                                ) : (
                                                    <KeyboardArrowLeft />
                                                )}
                                                Back
                                            </Button>
                                        }
                                    />
                                </Paper>
                            </Hidden>
                        </>
                    )}
                </Formik>
            </Right>
        </Root>
    );
};

export default NewResourceStepper;

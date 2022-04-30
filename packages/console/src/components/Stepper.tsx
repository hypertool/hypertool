import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    Button,
    CircularProgress,
    Divider,
    Icon,
    Stepper as MuiStepper,
    Step,
    StepLabel,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { Formik } from "formik";

import { useMounted } from "../hooks";

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

const StepContainer = styled("div")(() => ({
    height: "calc(100vh - 200px)",
}));

const ActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
}));

const LeftActionContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
}));

const StepperAction = styled(Button)(() => ({
    width: 120,
}));

const CreateAction = styled(Button)(() => ({
    width: 144,
}));

export interface IStep {
    title: string;
    optional: boolean;
    renderStep: () => ReactElement;
}

export interface IStepperProps<T> {
    title: string;
    description: string;
    steps: IStep[];
    onComplete: (values: T | Record<string, any>) => Promise<void>;
    isStepComplete: (step: number, context: any) => boolean;
    initialValues: any;
    validationSchema: any;
}

const Stepper: FunctionComponent<IStepperProps<any>> = <T,>(
    props: IStepperProps<T>,
): ReactElement => {
    const {
        title,
        description,
        steps,
        initialValues,
        validationSchema,
        onComplete,
        isStepComplete,
    } = props;
    const [activeStep, setActiveStep] = useState(0);
    const mounted = useMounted();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = useCallback(
        (values: Record<string, any>): void => {
            setProcessing(true);
            onComplete(values).then(() => {
                if (mounted.current) {
                    setProcessing(false);
                }
            });
        },
        [onComplete],
    );

    const handleNext = useCallback(() => {
        setActiveStep((previousActiveStep) => previousActiveStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((previousActiveStep) => previousActiveStep - 1);
    }, []);

    const renderStepperItem = (step: IStep, index: number, context: any) => {
        return (
            <Step key={step.title} completed={isStepComplete(index, context)}>
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

    const renderStepperItems = (context: any) =>
        steps.map((step: IStep, index: number) =>
            renderStepperItem(step, index, context),
        );

    return (
        <Root>
            <Left>
                <Title variant="h1">{title}</Title>
                <Help component="p" variant="caption">
                    {description}
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
                            <MuiStepper activeStep={activeStep}>
                                {renderStepperItems(formik)}
                            </MuiStepper>

                            <StepContainer>
                                {steps.map(
                                    (step, index) =>
                                        activeStep === index &&
                                        step.renderStep(),
                                )}
                            </StepContainer>

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
                                            <Icon>keyboard_arrow_left</Icon>
                                            Back
                                        </StepperAction>
                                    )}
                                </LeftActionContainer>

                                {activeStep < steps.length - 1 && (
                                    <StepperAction
                                        onClick={handleNext}
                                        variant="contained"
                                        size="small"
                                        disabled={
                                            !isStepComplete(activeStep, formik)
                                        }
                                    >
                                        Next
                                        <Icon>keyboard_arrow_right</Icon>
                                    </StepperAction>
                                )}

                                {activeStep + 1 === steps.length && (
                                    <CreateAction
                                        onClick={formik.submitForm}
                                        variant="contained"
                                        size="small"
                                        disabled={processing}
                                    >
                                        Create App
                                        {!processing && (
                                            <Icon
                                                fontSize="small"
                                                sx={{ ml: 1 }}
                                            >
                                                check_circle_outline
                                            </Icon>
                                        )}
                                        {processing && (
                                            <CircularProgress
                                                size="14px"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </CreateAction>
                                )}
                            </ActionContainer>
                        </>
                    )}
                </Formik>
            </Right>
        </Root>
    );
};

export default Stepper;

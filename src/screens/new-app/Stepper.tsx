import type { FunctionComponent, ReactElement } from "react";

import { useState } from "react";
import {
  Stepper,
  MobileStepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Hidden,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CheckCircle from "@mui/icons-material/CheckCircle";

import AboutStep from "./AboutStep";
import ResourcesStep from "./ResourcesStep";
import RepositoryStep from "./RepositoryStep";
import StepperComplete from "./StepperComplete";
import Wrap from "../../components/Wrap";

const StepContainer = styled("div")(({ theme }) => ({
  height: "calc(100vh - 200px)",
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
  width: 144,
}));

interface StepStructure {
  title: string;
  optional: boolean;
  component: FunctionComponent;
}

const steps: StepStructure[] = [
  {
    title: "Tell us about your app",
    optional: false,
    component: AboutStep,
  },
  {
    title: "Select your resources",
    optional: true,
    component: ResourcesStep,
  },
  {
    title: "Connect your repository",
    optional: false,
    component: RepositoryStep,
  },
];

interface AboutStepData {
  title: string;
  description: string;
  folder: string;
  skipped: false;
  completed: boolean;
}

interface ResourcesData {
  resources: any[];
  skipped: boolean;
  completed: boolean;
}

interface RepositoryData {
  repositoryURL: string;
  skipped: false;
  completed: boolean;
}

type Steps = [AboutStepData, ResourcesData, RepositoryData];

const defaultSteps: Steps = [
  {
    title: "",
    description: "",
    folder: "",
    skipped: false,
    completed: false,
  },
  {
    resources: [],
    skipped: false,
    completed: false,
  },
  {
    repositoryURL: "",
    skipped: false,
    completed: false,
  },
];

const NewAppStepper: FunctionComponent = (): ReactElement => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepTuple, setStepTuple] = useState<Steps>(defaultSteps);
  const theme = useTheme();
  const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));

  const handleNext = () => {
    if (activeStep + 1 === steps.length) {
      // setComplete(true);
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setStepTuple((oldStepTuple) => {
      const newStepTuple = JSON.parse(JSON.stringify(stepTuple));
      newStepTuple[activeStep].completed = true;
      return newStepTuple;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!steps[activeStep].optional) {
      /* You probably want to guard against something like this,
       * it should never occur unless someone's actively trying to break something.
       */
      throw new Error("You can't skip a step that isn't optional.");
    }

    setStepTuple((oldStepTuple) => {
      const newStepTuple = JSON.parse(JSON.stringify(stepTuple));
      newStepTuple[activeStep].skipped = true;
      return newStepTuple;
    });
  };

  const renderStepperItem = (step: StepStructure, index: number) => {
    return (
      <Step key={step.title} completed={stepTuple[index].completed}>
        <StepLabel
          optional={
            step.optional && <Typography variant="caption">Optional</Typography>
          }
        >
          {step.title}
        </StepLabel>
      </Step>
    );
  };

  const renderStepperItems = () => steps.map(renderStepperItem);

  const Component: FunctionComponent | null =
    activeStep < steps.length ? steps[activeStep].component : null;

  const complete = activeStep === steps.length;

  return (
    <div>
      <Hidden lgDown={true}>
        <Stepper activeStep={activeStep}>{renderStepperItems()}</Stepper>
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

      <Wrap
        when={smallerThanLg}
        wrapper={Container}
        style={{ height: "calc(100vh - 156px)" }}
      >
        <Wrap when={!smallerThanLg} wrapper={StepContainer}>
          <>
            {complete && <StepperComplete />}
            {Component && <Component />}
          </>
        </Wrap>
      </Wrap>

      {!complete && (
        <>
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
                {steps[activeStep].optional && (
                  <StepperAction
                    color="inherit"
                    onClick={handleSkip}
                    variant="contained"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Skip
                  </StepperAction>
                )}
              </LeftActionContainer>
              {activeStep < steps.length - 1 && (
                <StepperAction
                  onClick={handleNext}
                  variant="contained"
                  size="small"
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
                  onClick={handleNext}
                  variant="contained"
                  size="small"
                >
                  Create App
                  <CheckCircle fontSize="small" sx={{ ml: 1 }} />
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
                  backgroundColor: theme.palette.background.paper,
                  // marginTop: theme.spacing(11)
                }}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1}
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
    </div>
  );
};

export default NewAppStepper;

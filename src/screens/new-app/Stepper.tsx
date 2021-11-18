import type { FunctionComponent, ReactElement } from "react";

import { useState } from "react";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import AboutStep from "./AboutStep";
import ResourcesStep from "./ResourcesStep";
import RepositoryStep from "./RepositoryStep";
import StepperComplete from "./StepperComplete";

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

  const handleNext = () => {
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
      <Stepper activeStep={activeStep}>{renderStepperItems()}</Stepper>
      {complete && <StepperComplete />}
      {Component && <Component />}

      {!complete && (
        <ActionContainer>
          <LeftActionContainer>
            {activeStep > 0 && (
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                variant="contained"
                size="small"
              >
                Back
              </Button>
            )}
            {steps[activeStep].optional && (
              <Button
                color="inherit"
                onClick={handleSkip}
                variant="contained"
                size="small"
                sx={{ mr: 1 }}
              >
                Skip
              </Button>
            )}
          </LeftActionContainer>
          <Button onClick={handleNext} variant="contained" size="small">
            {activeStep === steps.length - 1 ? "Create App" : "Next"}
          </Button>
        </ActionContainer>
      )}
    </div>
  );
};

export default NewAppStepper;

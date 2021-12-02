import type { FunctionComponent, ReactElement } from "react";

import { useState, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CheckCircle from "@mui/icons-material/CheckCircle";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";

import AboutStep from "./AboutStep";
import ResourcesStep from "./ResourcesStep";
// import RepositoryStep from "./RepositoryStep";
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
    $description: String
    $groups: [ID!]
    $resources: [ID!]
  ) {
    createApp(
      name: $name
      description: $description
      groups: $groups
      resources: $resources
    ) {
      id
    }
  }
`;

interface StepModel {
  title: string;
  optional: boolean;
}

const steps: StepModel[] = [
  { title: "Tell us about your app", optional: false },
  {
    title: "Connect your repository",
    optional: true,
  },
];

const NewAppStepper: FunctionComponent = (): ReactElement => {
  const [activeStep, setActiveStep] = useState(0);
  const [resources, setResources] = useState<string[]>([]);
  const [
    createApp,
    { loading: creatingApp, error: createAppError, data: newApp },
  ] = useMutation(CREATE_APP);
  const theme = useTheme();
  const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));

  const handleResourcesSelected = useCallback((resources: string[]) => {
    setResources(resources);
  }, []);

  const handleSubmit = useCallback(
    (values: FormValues, helpers: FormikHelpers<FormValues>): void => {
      console.log(values, resources);
      createApp({
        variables: {
          ...values,
          resources,
        },
      });
    },
    [createApp, resources]
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepValuesValid = (step: number, context: any) => {
    if (step === 0) {
      return (
        context.values.name &&
        !context.errors.name &&
        !context.errors.description
      );
    }
  };

  const isStepComplete = (step: number, context: any) => {
    switch (step) {
      case 0: {
        return isStepValuesValid(step, context);
      }

      case 1: {
        return Boolean(newApp);
      }

      default: {
        throw new Error(`The specified step number (${step}) does not exist!`);
      }
    }
  };

  const renderStepperItem = (step: StepModel, index: number, context: any) => {
    return (
      <Step key={step.title} completed={isStepComplete(index, context)}>
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

  const renderStepperItems = (context: any) =>
    steps.map((step: StepModel, index: number) =>
      renderStepperItem(step, index, context)
    );

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <>
            <Hidden lgDown={true}>
              <Stepper activeStep={activeStep}>
                {renderStepperItems(formik)}
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
            <Wrap
              when={smallerThanLg}
              wrapper={Container}
              style={{ height: "calc(100vh - 156px)" }}
            >
              <Wrap when={!smallerThanLg} wrapper={StepContainer}>
                <>
                  {activeStep === 0 && <AboutStep />}
                  {activeStep === 1 && (
                    <ResourcesStep
                      onResourcesSelected={handleResourcesSelected}
                      selectedResources={resources}
                    />
                  )}
                </>
              </Wrap>
            </Wrap>

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
                    disabled={!isStepValuesValid(activeStep, formik)}
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
                    disabled={creatingApp}
                  >
                    Create App
                    {!creatingApp && !newApp && (
                      <CheckCircleOutline fontSize="small" sx={{ ml: 1 }} />
                    )}
                    {!creatingApp && newApp && (
                      <CheckCircle fontSize="small" sx={{ ml: 1 }} />
                    )}
                    {creatingApp && (
                      <CircularProgress size="14px" sx={{ ml: 1 }} />
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
      </Formik>
    </div>
  );
};

export default NewAppStepper;

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
  useTheme,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { Formik } from "formik";
import * as yup from "yup";

import type { ResourceType } from "../../types";

import ConfigureStep from "./ConfigureStep";
import SelectStep from "./SelectStep";

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
    title: "Select your resource type",
    optional: false,
    component: SelectStep,
  },
  {
    title: "Configure your resource",
    optional: false,
    component: ConfigureStep,
  },
];

interface SelectStepData {
  type: ResourceType | undefined;
  skipped: false;
  completed: boolean;
}

interface ConfigureStepData {
  skipped: false;
  completed: boolean;
}

type Steps = [SelectStepData, ConfigureStepData];

const defaultSteps: Steps = [
  {
    type: undefined,
    skipped: false,
    completed: false,
  },
  {
    skipped: false,
    completed: false,
  },
];

interface PostgresFormValues {
  resourceName: string;
  host: string;
  port: string;
  databaseName: string;
  databaseUserName: string;
  databasePassword: string;
  connectUsingSSL: boolean;
}

interface MySQLFormValues {
  resourceName: string;
  host: string;
  port: string;
  databaseName: string;
  databaseUserName: string;
  databasePassword: string;
  connectUsingSSL: boolean;
}

interface InitialValues {
  postgres: PostgresFormValues;
  mysql: MySQLFormValues;
}

const initialValues: InitialValues = {
  postgres: {
    resourceName: "",
    host: "",
    port: "",
    databaseName: "",
    databaseUserName: "",
    databasePassword: "",
    connectUsingSSL: false,
  },
  mysql: {
    resourceName: "",
    host: "",
    port: "",
    databaseName: "",
    databaseUserName: "",
    databasePassword: "",
    connectUsingSSL: false,
  },
};

const validationSchemas: { [key: string]: any } = {
  postgres: yup.object({
    resourceName: yup
      .string()
      .max(256, "Resource name should 256 characters or less")
      .required("Resource name is required"),
    host: yup.string().required("Host is required"),
    port: yup
      .number()
      .typeError("Port number should be an integer")
      .integer("Port number should be an integer")
      .required("Port number is required"),
    databaseName: yup.string().required("Please specify a valid database name"),
    databaseUserName: yup
      .string()
      .required("Please specify a valid database user name"),
    databasePassword: yup
      .string()
      .required("Please specify a valid database password"),
    connectUsingSSL: yup.boolean().default(false),
  }),
  mysql: yup.object({
    resourceName: yup
      .string()
      .max(256, "Resource name should 256 characters or less")
      .required("Resource name is required"),
    host: yup.string().required("Host is required"),
    port: yup
      .number()
      .typeError("Port number should be an integer")
      .integer("Port number should be an integer")
      .required("Port number is required"),
    databaseName: yup.string().required("Please specify a valid database name"),
    databaseUserName: yup
      .string()
      .required("Please specify a valid database user name"),
    databasePassword: yup
      .string()
      .required("Please specify a valid database password"),
    connectUsingSSL: yup.boolean().default(false),
  }),
};

const NewResourceStepper: FunctionComponent = (): ReactElement => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepTuple, setStepTuple] = useState<Steps>(defaultSteps);
  const [resourceType, setResourceType] = useState<ResourceType | undefined>(
    undefined
  );
  const theme = useTheme();

  const handleSubmit = useCallback((values: any) => {
    console.log(values);
  }, []);

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

  const handleResourceTypeChange = useCallback(
    (newResourceType: ResourceType) => {
      setResourceType(newResourceType);
    },
    []
  );

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

  if (activeStep === steps.length) {
    return <span>complete</span>;
  }

  return (
    <Root>
      <Left>
        <Title variant="h1">Create new resource</Title>
        <Help component="p" variant="caption">
          Resources let you connect to your database or API. Once you add a
          resource here, you can choose which app has access to which resource.
        </Help>
      </Left>

      <Divider orientation="vertical" flexItem={true} sx={{ mr: 4 }} />

      <Right>
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

        <Formik
          initialValues={
            activeStep > 0
              ? (initialValues as any)[resourceType as ResourceType]
              : {}
          }
          onSubmit={handleSubmit}
          validationSchema={
            activeStep > 0
              ? validationSchemas[resourceType as ResourceType]
              : undefined
          }
        >
          {(formik) => (
            <>
              <StepContainer>
                {activeStep === 0 && (
                  <SelectStep
                    onChange={handleResourceTypeChange}
                    activeType={resourceType}
                  />
                )}

                {resourceType && activeStep === 1 && (
                  <ConfigureStep activeType={resourceType} />
                )}
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
                      disabled={
                        (activeStep === 0 && !resourceType) ||
                        (activeStep === 1 && (!formik.dirty || !formik.isValid))
                      }
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
                        (activeStep === 0 && !resourceType) ||
                        (activeStep === 1 && (!formik.dirty || !formik.isValid))
                      }
                    >
                      Create Resource
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
        </Formik>
      </Right>
    </Root>
  );
};

export default NewResourceStepper;

import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

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

import { gql, useMutation } from "@apollo/client";

import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router";

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

const Right = styled("div")(() => ({
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

interface MongoDBFormValues {
    resourceName: string;
    host: string;
    port: string;
    databaseName: string;
    databaseUserName: string;
    databasePassword: string;
    connectUsingSSL: boolean;
}

interface BigQueryFormValues {
    resourceName: string;
    serviceAccountKey: string;
}

interface InitialValues {
    postgres: PostgresFormValues;
    mysql: MySQLFormValues;
    mongodb: MongoDBFormValues;
    bigquery: BigQueryFormValues;
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
    mongodb: {
        resourceName: "",
        host: "",
        port: "",
        databaseName: "",
        databaseUserName: "",
        databasePassword: "",
        connectUsingSSL: false,
    },
    bigquery: {
        resourceName: "",
        serviceAccountKey: "",
    },
};

const validationSchemas: { [key: string]: any } = {
    postgres: yup.object({
        resourceName: yup
            .string()
            .max(256, "Resource name should be 256 characters or less")
            .required("Resource name is required"),
        description: yup
            .string()
            .max(512, "Description should be 512 characters or less"),
        host: yup.string().required("Host is required"),
        port: yup
            .number()
            .typeError("Port number should be an integer")
            .integer("Port number should be an integer")
            .required("Port number is required"),
        databaseName: yup.string().required("Database name is required"),
        databaseUserName: yup
            .string()
            .required("Database user name is required"),
        databasePassword: yup
            .string()
            .required("Database password is required"),
        /*
         * NOTE: Since checkboxes are maintained as arrays by Formik, we cannot really specify
         * a validator for a boolean value.
         */
        // connectUsingSSL: yup.boolean().default(false),
    }),
    mysql: yup.object({
        resourceName: yup
            .string()
            .max(256, "Resource name should be 256 characters or less")
            .required("Resource name is required"),
        host: yup.string().required("Host is required"),
        port: yup
            .number()
            .typeError("Port number should be an integer")
            .integer("Port number should be an integer")
            .required("Port number is required"),
        databaseName: yup.string().required("Database name is required"),
        databaseUserName: yup
            .string()
            .required("Database user name is required"),
        databasePassword: yup
            .string()
            .required("Database password is required"),
        connectUsingSSL: yup.boolean().default(false),
    }),
    mongodb: yup.object({
        resourceName: yup
            .string()
            .max(256, "Resource name should be 256 characters or less")
            .required("Resource name is required"),
        host: yup.string().required("Host is required"),
        port: yup
            .number()
            .typeError("Port number should be an integer")
            .integer("Port number should be an integer")
            .required("Port number is required"),
        databaseName: yup.string().required("Database name is required"),
        databaseUserName: yup
            .string()
            .required("Database user name is required"),
        databasePassword: yup
            .string()
            .required("Database password is required"),
        connectUsingSSL: yup.boolean().default(false),
    }),
    bigquery: yup.object({
        resourceName: yup
            .string()
            .max(256, "Resource name should be 256 characters or less")
            .required("Resource name is required"),
        serviceAccountKey: yup
            .string()
            .required("Service account key is required"),
    }),
};

const CREATE_RESOURCE = gql`
    mutation CreateResource(
        $name: String!
        $description: String
        $type: ResourceType!
        $mysql: MySQLConfigurationInput
        $postgres: PostgresConfigurationInput
        $mongodb: MongoDBConfigurationInput
        $bigquery: BigQueryConfigurationInput
    ) {
        createResource(
            name: $name
            description: $description
            type: $type
            mysql: $mysql
            postgres: $postgres
            mongodb: $mongodb
            bigquery: $bigquery
        ) {
            id
            name
            description
            type
        }
    }
`;

const NewResourceStepper: FunctionComponent = (): ReactElement => {
    const [activeStep, setActiveStep] = useState(0);
    const [resourceType, setResourceType] = useState<ResourceType | undefined>(
        undefined,
    );
    const theme = useTheme();
    const [
        createResource,
        {
            loading: creatingResource,
            // error: createResourceError,
            data: newResource,
        },
    ] = useMutation(CREATE_RESOURCE);
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        (values: any) => {
            if (!resourceType) {
                throw new Error("Resource type should be defined.");
            }

            const {
                resourceName: name,
                description,
                ...configuration
            } = values;
            if (
                configuration.hasOwnProperty("connectUsingSSL") &&
                configuration.connectUsingSSL?.constructor === Array
            ) {
                configuration.connectUsingSSL =
                    configuration.connectUsingSSL.length > 0;
            } else {
                configuration.connectUsingSSL = Boolean(
                    configuration.connectUsingSSL,
                );
            }

            createResource({
                variables: {
                    name,
                    description,
                    type: resourceType,
                    [resourceType as string]: configuration,
                },
            });
        },
        [createResource, resourceType],
    );

    useEffect(() => {
        if (newResource) {
            navigate(`/resources/${newResource.createResource.id}/edit`);
        }
    }, [navigate, newResource]);

    const handleNext = () => {
        if (activeStep + 1 === steps.length) {
            return;
        }

        setActiveStep((previousActiveStep) => previousActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleResourceTypeChange = useCallback(
        (newResourceType: ResourceType) => {
            setResourceType(newResourceType);
        },
        [],
    );

    const isStepComplete = (step: number) => {
        switch (step) {
            case 0:
                return Boolean(resourceType);

            case 1:
                return Boolean(newResource);

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
                    }>
                    {step.title}
                </StepLabel>
            </Step>
        );
    };

    const renderStepperItems = () => steps.map(renderStepperItem);

    return (
        <Root>
            <Left>
                <Title variant="h1">Create new resource</Title>
                <Help component="p" variant="caption">
                    Resources let you connect to your database or API. Once you
                    add a resource here, you can choose which app has access to
                    which resource.
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
                        }}>
                        <Typography>{steps[activeStep].title}</Typography>
                    </Paper>
                </Hidden>

                <Formik
                    initialValues={
                        activeStep > 0
                            ? (initialValues as any)[
                                  resourceType as ResourceType
                              ]
                            : {}
                    }
                    onSubmit={handleSubmit}
                    validationSchema={
                        activeStep > 0
                            ? validationSchemas[resourceType as ResourceType]
                            : undefined
                    }>
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
                                                size="small">
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
                                            disabled={
                                                (activeStep === 0 &&
                                                    !resourceType) ||
                                                (activeStep === 1 &&
                                                    (!formik.dirty ||
                                                        !formik.isValid))
                                            }>
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
                                                (activeStep === 0 &&
                                                    !resourceType) ||
                                                (activeStep === 1 &&
                                                    (!formik.dirty ||
                                                        !formik.isValid)) ||
                                                creatingResource
                                            }>
                                            Create Resource
                                            {!creatingResource &&
                                                !newResource && (
                                                    <CheckCircleOutline
                                                        fontSize="small"
                                                        sx={{ ml: 1 }}
                                                    />
                                                )}
                                            {!creatingResource &&
                                                newResource && (
                                                    <CheckCircle
                                                        fontSize="small"
                                                        sx={{ ml: 1 }}
                                                    />
                                                )}
                                            {creatingResource && (
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
                                    }}>
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
                                                }>
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
                                                disabled={activeStep === 0}>
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

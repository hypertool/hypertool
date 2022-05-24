import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";

import { Container as MuiContainer, styled } from "@mui/material";

import * as yup from "yup";

import Stepper, { IStep } from "../../components/Stepper";

import AdministratorDetailsStep from "./AdministratorDetailsStep";
import AppDetailsStep from "./AppDetailsStep";
import Welcome from "./Welcome";

const Container = styled(MuiContainer)(({ theme }) => ({}));

interface IFormValues {
    name: string;
    title: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
}

const validationSchema = yup.object({
    name: yup
        .string()
        .max(128, "Name should be 128 characters or less")
        .required("Name is required"),
    title: yup
        .string()
        .max(256, "Title should be 128 characters or less")
        .required("Title is required"),
    firstName: yup
        .string()
        .max(30, "First name should be 30 characters or less")
        .required("First name is required"),
    lastName: yup
        .string()
        .max(30, "Last name should be 30 characters or less")
        .required("Last name is required"),
    emailAddress: yup
        .string()
        .max(255, "Email address should be 255 characters or less")
        .required("Email address is required"),
    password: yup
        .string()
        .min(8, "Password should be 8 characters or more")
        .max(128, "Password should be 128 characters or less")
        .required("Password is required"),
});

const initialValues: IFormValues = {
    name: "",
    title: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
};

const Installation: FunctionComponent = (): ReactElement => {
    const [start, setStart] = useState(false);

    const handleStart = useCallback(() => {
        setStart(true);
    }, []);

    const steps: IStep[] = useMemo(
        () => [
            {
                title: "Root app details",
                optional: false,
                renderStep: () => <AppDetailsStep />,
            },
            {
                title: "Administrator details",
                optional: false,
                renderStep: () => <AdministratorDetailsStep />,
            },
            /*
             * {
             *     title: "Hypertool Newsletter",
             *     optional: false,
             *     renderStep: () => <NewsletterStep />,
             * },
             */
        ],
        [],
    );

    const isStepComplete = useCallback((step: number, context: any) => {
        const { values, errors } = context;
        switch (step) {
            case 0: {
                return (
                    values.name && values.title && !errors.name && !errors.title
                );
            }

            case 1: {
                return (
                    values.firstName &&
                    values.lastName &&
                    values.emailAddress &&
                    values.password &&
                    !errors.firstName &&
                    !errors.lastName &&
                    !errors.emailAddress &&
                    !errors.password
                );
            }

            default: {
                throw new Error(
                    `The specified step number (${step}) does not exist!`,
                );
            }
        }
    }, []);

    const handleComplete = useCallback(async (values: any): Promise<void> => {
        return;
    }, []);

    return (
        <div>
            {!start && <Welcome onPrimaryAction={handleStart} />}
            {start && (
                <Container>
                    <Stepper
                        title="Install Hypertool"
                        description="Hypertool is an open-source low code platform that helps you build internal tools quickly."
                        steps={steps}
                        onComplete={handleComplete}
                        isStepComplete={isStepComplete}
                        validationSchema={validationSchema}
                        initialValues={initialValues}
                        finalActionText="Install Hypertool"
                    />
                </Container>
            )}
        </div>
    );
};

export default Installation;

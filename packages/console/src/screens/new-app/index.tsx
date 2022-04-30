import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";

import { Container as MuiContainer } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation } from "@apollo/client";

import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import Stepper, { IStep } from "../../components/Stepper";
import { useNotification, usePrivateSession } from "../../hooks";

import AboutStep from "./AboutStep";
import SelectTemplateStep from "./SelectTemplateStep";

const Container = styled(MuiContainer)(({ theme }) => ({}));

const CREATE_APP = gql`
    mutation CreateApp(
        $name: String!
        $title: String!
        $description: String!
        $organization: ID
    ) {
        createApp(
            name: $name
            title: $title
            organization: $organization
            description: $description
        ) {
            id
        }
    }
`;

interface IFormValues {
    name: string;
    title: string;
    description: string;
}

const initialValues: IFormValues = {
    name: "",
    title: "",
    description: "",
};

const validationSchema = yup.object({
    name: yup
        .string()
        .max(128, "Name should be 128 characters or less")
        .required("Name is required"),
    title: yup
        .string()
        .max(256, "Title should be 128 characters or less")
        .required("Title is required"),
    description: yup
        .string()
        .max(512, "Description should be 512 characters or less"),
});

const NewApp: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    const notification = useNotification();
    const [createApp, { loading, data }] = useMutation(CREATE_APP, {
        refetchQueries: ["GetApps"],
    });
    const [template, setTemplate] = useState<"$empty" | string>("$empty");

    const handleTemplateChange = useCallback((id: string) => {
        setTemplate(id);
    }, []);

    const steps: IStep[] = useMemo(
        () => [
            {
                title: "About app",
                optional: false,
                renderStep: () => <AboutStep />,
            },
            {
                title: "Choose template",
                optional: true,
                renderStep: () => (
                    <SelectTemplateStep
                        activeTemplate={template}
                        onChange={handleTemplateChange}
                    />
                ),
            },
        ],
        [template],
    );

    const handleComplete = useCallback(
        async (values: IFormValues): Promise<void> => {
            try {
                notification.notify({
                    type: "info",
                    message: `Creating screen "${values.name}"...`,
                    closeable: false,
                    autoCloseDuration: -1,
                });

                const result = await createApp({
                    variables: {
                        ...values,
                        sourceApp: template === "$empty" ? undefined : template,
                    },
                });

                notification.notifySuccess(
                    `Created screen "${values.name}" successfully`,
                );

                navigate(`/apps/${result.data.createApp.id}/builder`);
            } catch (error) {
                notification.notifyError(error);
            }
        },
        [],
    );

    const isStepComplete = useCallback((step: number, context: any) => {
        const { values, errors } = context;
        switch (step) {
            case 0: {
                return (
                    values.name &&
                    values.title &&
                    !errors.name &&
                    !errors.title &&
                    !errors.description
                );
            }

            case 1: {
                return true;
            }

            default: {
                throw new Error(
                    `The specified step number (${step}) does not exist!`,
                );
            }
        }
    }, []);

    return (
        <Container>
            <Stepper
                title="Create new app"
                description="An app provides an interface for the user to interact with your platform on Android, iOS, and web."
                steps={steps}
                onComplete={handleComplete}
                isStepComplete={isStepComplete}
                validationSchema={validationSchema}
                initialValues={initialValues}
            />
        </Container>
    );
};

export default NewApp;

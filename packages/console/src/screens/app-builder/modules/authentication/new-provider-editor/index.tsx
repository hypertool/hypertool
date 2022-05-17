import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";

import { Container as MuiContainer } from "@mui/material";
import { styled } from "@mui/material/styles";

import * as yup from "yup";

import Stepper, { IStep } from "../../../../../components/Stepper";
import { useNotification } from "../../../../../hooks";

import ConfigureProviderStep from "./ConfigureProviderStep";
import SelectProviderStep from "./SelectProviderStep";

const Container = styled(MuiContainer)(({ theme }) => ({}));

interface IFormValues {
    enablePasswordlessAuthentication: boolean;
}

const initialValues: IFormValues = {
    enablePasswordlessAuthentication: false,
};

const validationSchema = yup.object({
    enablePasswordlessAuthentication: yup.boolean(),
});

const NewProviderEditor: FunctionComponent = (): ReactElement => {
    const notification = useNotification();
    const [provider, setProvider] = useState<any | null>(null);

    const handleProviderChange = useCallback((id: string) => {
        setProvider(id);
    }, []);

    const steps: IStep[] = useMemo(
        () => [
            {
                title: "Choose provider",
                optional: false,
                renderStep: () => (
                    <SelectProviderStep
                        onChange={handleProviderChange}
                        activeProvider={provider}
                    />
                ),
            },
            {
                title: "Configure provider",
                optional: false,
                renderStep: () => <ConfigureProviderStep provider={provider} />,
            },
        ],
        [provider],
    );

    const handleComplete = useCallback(
        async (values: IFormValues): Promise<void> => {
            try {
                notification.notify({
                    type: "info",
                    message: `Creating authentication provider "${provider}"...`,
                    closeable: false,
                    autoCloseDuration: -1,
                });

                // TODO

                notification.notifySuccess(
                    `Created authentication provider "${provider}" successfully`,
                );
            } catch (error) {
                notification.notifyError(error);
            }
        },
        [provider, notification],
    );

    const isStepComplete = useCallback(
        (step: number, context: any) => {
            const { values, errors } = context;
            switch (step) {
                case 0: {
                    return Boolean(provider);
                }

                case 1: {
                    return (
                        values.enablePasswordlessAuthentication &&
                        !errors.enablePasswordlessAuthentication
                    );
                }

                default: {
                    throw new Error(
                        `The specified step number (${step}) does not exist!`,
                    );
                }
            }
        },
        [provider],
    );

    return (
        <Container>
            <Stepper
                title="Create new provider"
                description="An authentication provider allows your users to authenticate themselves using different mechanisms."
                steps={steps}
                onComplete={handleComplete}
                isStepComplete={isStepComplete}
                validationSchema={validationSchema}
                initialValues={initialValues}
                finalActionText="Create Provider"
            />
        </Container>
    );
};

export default NewProviderEditor;

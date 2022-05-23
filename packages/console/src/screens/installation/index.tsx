import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";

import { Container as MuiContainer, styled } from "@mui/material";

import * as yup from "yup";

import Stepper, { IStep } from "../../components/Stepper";

import Welcome from "./Welcome";

const Container = styled(MuiContainer)(({ theme }) => ({}));

const validationSchema = yup.object();

const initialValues = {};

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
                renderStep: () => <div>App details</div>,
            },
            {
                title: "Administrator details",
                optional: false,
                renderStep: () => <div>User details</div>,
            },
            {
                title: "Hypertool Newsletter",
                optional: false,
                renderStep: () => <div>User details</div>,
            },
        ],
        [],
    );

    const isStepComplete = useCallback(
        (step: number, context: any) => false,
        [],
    );

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
                        finalActionText="Create Provider"
                    />
                </Container>
            )}
        </div>
    );
};

export default Installation;

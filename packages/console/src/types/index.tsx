import type { FunctionComponent } from "react";

import { constants } from "@hypertool/common";

import { constants as consoleConstants } from "../utils";

const { resourceStatuses, resourceTypes } = constants;

export type ResourceType = typeof resourceTypes[number];

export type ResourceStatus = typeof resourceStatuses[number];
export interface AuthenticationServicesType {
    id: number;
    name: string;
    description: string;
}

export interface FormField {
    id: string;
    type:
        | "text"
        | "large_text"
        | "number"
        | "date"
        | "time"
        | "date_time"
        | "switch"
        | "date_range"
        | "select"
        | "multi_select"
        | "email_address"
        | "phone_number"
        | "handler";
    help: string;
}

export interface FormSelectOption {
    value: string;
    title: string;
}

export interface FormSelect extends FormField {
    required: boolean;
    title: string;
    options: FormSelectOption[];
    size: "small" | "medium";
    variant: "standard" | "outlined" | "filled";
}

export interface FormTextField extends FormField {
    required: boolean;
    title: string;
    variant: "standard" | "outlined" | "filled";
    size: "small" | "medium" | "large";
}

export interface FormLargeTextField extends FormTextField {
    rows?: number;
}

export interface FormSwitch extends FormField {
    title: string;
    size: "small" | "medium";
}

export type FormFieldType =
    | FormSelect
    | FormTextField
    | FormLargeTextField
    | FormSwitch;

export interface FormFieldGroup {
    title: string;
    fields: FormFieldType[];
}

export interface FormDescription {
    groups: FormFieldGroup[];
}

export interface CraftProps {
    craft: any;
}

export type CraftComponent<P> = FunctionComponent<P> & CraftProps;

export type ButtonVariant = "text" | "outlined" | "contained";

export type ButtonSize = "small" | "medium" | "large";

/**
 * Inflating basically refers to evaluating the source code of an artifact.
 */
export interface IDeflatedArtifact {
    id: string;
    code: string;
}

/**
 * An artifact is a combination of the following properties:
 * 1. Artifact ID
 * 2. Source code
 * 3. Object returned by the initializer
 */
export interface IArtifact extends IDeflatedArtifact {
    /**
     * The object returned by the initializer when inflating the artifact.
     */
    object: any;
}

export interface IArtifactsContext {
    [artifactId: string]: IArtifact;
}

export interface IArtifactReference {
    artifactId: string;
    target: string;
}

export type SelectSize = "small" | "normal";

export type SelectVariant = "filled" | "standard" | "outlined";

export type SelectMargin = "none" | "dense" | "normal";

export type CheckboxSize = "small" | "medium";

export type BaseColor =
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";

export type Color = "inherit" | BaseColor;

export type TTabType = typeof consoleConstants.tabTypes[number];

export interface ITab {
    id: string;
    title: string;
    icon: string;
    type: TTabType;
}

export interface IBuilderActionsContext {
    createNewTab: (title: string, type: TTabType) => void;
    tabs: ITab[];
    activeTab: string | null;
    setActiveTab: (activeTab: string) => void;
}

export type ChipVariant = "filled" | "outlined";

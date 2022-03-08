import type { FunctionComponent } from "react";

import { constants } from "@hypertool/common";

import { constants as consoleConstants } from "../utils";

const { resourceStatuses, resourceTypes } = constants;

export type TResourceType = typeof resourceTypes[number];

export type TResourceStatus = typeof resourceStatuses[number];
export interface IAuthenticationServicesType {
    id: number;
    name: string;
    description: string;
}

export interface IFormField {
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

export interface IFormSelectOption {
    value: string;
    title: string;
}

export interface IFormSelect extends IFormField {
    required: boolean;
    title: string;
    options: IFormSelectOption[];
    size: "small" | "medium";
    variant: "standard" | "outlined" | "filled";
}

export interface IFormTextField extends IFormField {
    required: boolean;
    title: string;
    variant: "standard" | "outlined" | "filled";
    size: "small" | "medium" | "large";
}

export interface IFormLargeTextField extends IFormTextField {
    rows?: number;
}

export interface IFormSwitch extends IFormField {
    title: string;
    size: "small" | "medium";
}

export type TFormFieldType =
    | IFormSelect
    | IFormTextField
    | IFormLargeTextField
    | IFormSwitch;

export interface IFormFieldGroup {
    title: string;
    fields: TFormFieldType[];
}

export interface IFormDescription {
    groups: IFormFieldGroup[];
}

export interface ICraftProps {
    craft: any;
}

export type TCraftComponent<P> = FunctionComponent<P> & ICraftProps;

export type TButtonVariant = "text" | "outlined" | "contained";

export type TButtonSize = "small" | "medium" | "large";

/**
 * Inflating basically refers to evaluating the source code of an artifact.
 */
export interface IDeflatedArtifact {
    id: string;
    code: string;
    path: string;
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

export type TSelectSize = "small" | "normal";

export type TSelectVariant = "filled" | "standard" | "outlined";

export type TSelectMargin = "none" | "dense" | "normal";

export type TCheckboxSize = "small" | "medium";

export type TBaseColor =
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";

export type TColor = "inherit" | TBaseColor;

export type TTabType = typeof consoleConstants.tabTypes[number];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITabBundle {}

export interface IEditQueryBundle extends ITabBundle {
    queryId: string;
}

export interface IEditControllerBundle extends ITabBundle {
    controllerId: string;
}

export interface IEditScreenBundle extends ITabBundle {
    screenId: string;
}

export interface IEditResourceBundle extends ITabBundle {
    resourceId: string;
}

export type TBundleType =
    | IEditQueryBundle
    | IEditControllerBundle
    | IEditScreenBundle
    | IEditResourceBundle;

export interface ITab {
    id: string;
    title: string;
    icon: string;
    type: TTabType;
    bundle?: TBundleType;
}

export interface IBuilderActionsContext {
    tabs: ITab[];
    activeTab: string | null;
    insertTab: (
        index: number,
        replace: boolean,
        type: TTabType,
        bundle?: TBundleType,
    ) => void;
    createTab: (type: TTabType, bundle?: TBundleType) => void;
    replaceTab: (index: number, type: TTabType, bundle?: TBundleType) => void;
    setTabTitle: (index: number, title: string) => void;
    setActiveTab: (activeTab: string) => void;
    closeTab: (index: number) => void;
}

export interface ISessionContext {
    reloadSession: () => void;
}

export interface ITabContext {
    tab: ITab;
    index: number;
    active: boolean;
}

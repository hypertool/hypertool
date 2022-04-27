import type { FunctionComponent, ReactNode } from "react";

import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";

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
    id: string;
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
 * A module represents a collection of symbols. Each symbol can be referenced
 * by the app builder.
 */
export interface IModule {
    /**
     * The id of the module.
     *
     * A module ID is formatted is prefixed with `@hypertool` for synthetic
     * modules.
     */
    id: string;

    /**
     * Deterines whether the module is built-in to Hypertool.
     */
    synthetic: boolean;

    /**
     * The symbols that are defined in this module.
     */
    symbols: string[];

    /**
     * The object that contains the symbols at runtime.
     */
    object?: any;
}

export type TModulesContext = Record<string, IModule>;

export interface ISymbolReference {
    moduleId: string;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITabBundle {}

export interface IEditQueryBundle extends ITabBundle {
    queryTemplateId: string;
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

export interface ITab<T = TBundleType> {
    id: string;
    title: string;
    icon: string;
    type: TTabType;
    bundle?: T;
}

export type TPredicate<E> = {
    bivarianceHack(value: E): boolean;
}["bivarianceHack"];

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
    closeTabs: (predicate: TPredicate<ITab>) => void;
}

export interface IUser {
    id: string;
}

export interface ISession {
    jwtToken: string;
    user: IUser;
    createdAt: Date;
}

export interface ISessionContext extends Partial<ISession> {
    client: ApolloClient<NormalizedCacheObject>;
    reload: () => void;
}

export interface IPrivateSessionContext extends ISession {
    client: ApolloClient<NormalizedCacheObject>;
    reload: () => void;
}

export interface ITabContext<T = TBundleType> {
    tab: ITab<T>;
    index: number;
    active: boolean;
}

export type THandleCloseNotification = (notification: INotification) => void;

export interface INotificationRequest {
    type: "success" | "error" | "info" | "warning";

    message: string;

    /**
     * Determines whether the notification is closeable by the user.
     * When `!closeable && autoCloseDuration < 0 && !action`, an indefinite
     * loader is shown on the right side of the notification.
     */
    closeable: boolean;

    /**
     * Determines the duration after which the notification automatically closes.
     * If not specified, for closeable notifications, the notification will stay
     * open until the user dismisses it. And for non-closeable notifications, the
     * notification will stay open until the notifier manually closes the
     * notification.
     */
    autoCloseDuration?: number;

    action?: ReactNode;

    onClose?: THandleCloseNotification;
}

export interface INotification extends INotificationRequest {
    id: string;
}

export interface INotificationContext {
    notify: (notification: INotificationRequest) => void;
    notifyError: (error: any) => void;
    close: () => void;
}

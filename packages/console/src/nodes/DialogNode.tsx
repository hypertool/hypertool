import type { ReactElement } from "react";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

import Dialog, { IDialogProps } from "./Dialog";
import Node from "./Node";

const DialogNode: CraftComponent<IDialogProps> = (
    props: IDialogProps,
): ReactElement => {
    return (
        <Node>
            <Dialog {...props} />
        </Node>
    );
};

const defaultProps: IDialogProps = {
    id: "",
    open: false,
    disableEscapeKeyDown: false,
    fullScreen: false,
    fullWidth: false,
    maxWidth: "none",
    onClose: undefined,
    scroll: "paper",
    transition: "fade",
};

DialogNode.defaultProps = defaultProps;

DialogNode.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        id: "general",
                        title: "General",
                        fields: [
                            {
                                id: "id",
                                title: "ID",
                                type: "text",
                                size: "small",
                                help: "The identifier of the text field.",
                                required: false,
                            },
                            {
                                id: "open",
                                title: "Open",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the dialog is open, or not.",
                                required: true,
                            },
                            {
                                id: "disableEscapeKeyDown",
                                title: "Disable Escape Key Down",
                                type: "switch",
                                size: "small",
                                help: "Determines whether onClose is invoked, when escape key is pressed.",
                                required: true,
                            },
                            {
                                id: "fullScreen",
                                title: "Full Screen",
                                type: "switch",
                                size: "small",
                                help: "Determines whether dialog is full screen.",
                                required: true,
                            },
                            {
                                id: "fullWidth",
                                title: "Full Width",
                                type: "switch",
                                size: "small",
                                help: "Determines whether dialog is full width.",
                                required: true,
                            },
                            {
                                id: "scroll",
                                title: "Scroll",
                                type: "select",
                                size: "small",
                                help: "Determines the container for scrolling the dialog.",
                                required: false,
                                options: [
                                    {
                                        value: "paper",
                                        title: "Paper",
                                    },
                                    {
                                        value: "body",
                                        title: "Body",
                                    },
                                ],
                            },
                            {
                                id: "transition",
                                title: "Transition",
                                type: "select",
                                size: "small",
                                help: "Determines the transition style.",
                                required: false,
                                options: [
                                    {
                                        value: "collapse",
                                        title: "Collapse",
                                    },
                                    {
                                        value: "fade",
                                        title: "Fade",
                                    },
                                    {
                                        value: "grow",
                                        title: "Grow",
                                    },
                                    {
                                        value: "slide",
                                        title: "Slide",
                                    },
                                    {
                                        value: "zoom",
                                        title: "Zoom",
                                    },
                                ],
                            },
                            {
                                id: "onClose",
                                size: "small",
                                help: "The name of the callback to invoke on close.",
                                type: "handler",
                                required: true,
                                title: "On Close",
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

export default DialogNode;

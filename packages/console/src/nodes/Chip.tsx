import type { ReactElement } from "react";

import { Chip as MuiChip } from "@mui/material";

import { useNode } from "@craftjs/core";

import { useArtifactReference } from "../hooks";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type {
    BaseColor,
    CheckboxSize as ChipSize,
    ChipVariant,
    CraftComponent,
    IArtifactReference,
} from "../types";

interface Props {
    label?: string;
    size?: ChipSize;
    color?: BaseColor;
    variant?: ChipVariant;
    clickable?: boolean;
    disabled?: boolean;
    onClick?: IArtifactReference;
    onDelete?: IArtifactReference;
}

export const Chip: CraftComponent<Props> = (props: Props): ReactElement => {
    const {
        size,
        label,
        color,
        variant,
        onClick,
        onDelete,
        disabled,
        clickable,
    } = props;
    const {
        connectors: { connect, drag },
    } = useNode();
    const handleClick = useArtifactReference(onClick);
    const handleDelete = useArtifactReference(onDelete);
    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <MuiChip
                label={label}
                size={size}
                color={color}
                variant={variant}
                onDelete={handleDelete}
                onClick={handleClick}
                disabled={disabled}
                clickable={clickable}
            />
        </div>
    );
};

const defaultProps: Props = {
    label: "Label",
    color: "primary",
    variant: "filled",
    clickable: false,
    disabled: false,
    onClick: undefined,
    onDelete: undefined,
};

Chip.defaultProps = defaultProps;

Chip.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        title: "General",
                        fields: [
                            {
                                id: "label",
                                size: "small",
                                help: "The text of the chip.",
                                type: "text",
                                required: true,
                                title: "Label",
                            },
                            //TODO change this when color component is implemented
                            {
                                id: "color",
                                size: "small",
                                help: "The color of the chip.",
                                type: "select",
                                required: true,
                                title: "Color",
                                options: [
                                    { value: "primary", title: "Primary" },
                                    { value: "secondary", title: "Secondary" },
                                    { value: "success", title: "Success" },
                                    { value: "error", title: "Error" },
                                    { value: "info", title: "Info" },
                                    { value: "warning", title: "Warning" },
                                ],
                            },
                            {
                                id: "onClick",
                                size: "small",
                                help: "The name of the callback to invoke on click.",
                                type: "handler",
                                required: true,
                                title: "On Click",
                            },
                            {
                                id: "onDelete",
                                size: "small",
                                help: "The name of the callback to invoke on delete.",
                                type: "handler",
                                required: true,
                                title: "On Delete",
                            },
                            {
                                id: "variant",
                                size: "small",
                                help: "The type of the chip.",
                                type: "select",
                                required: true,
                                title: "Variant",
                                options: [
                                    { value: "outlined", title: "Outlined" },
                                    { value: "filled", title: "Filled" },
                                ],
                            },
                            {
                                id: "disabled",
                                title: "Disabled",
                                type: "switch",
                                size: "small",
                                help: "Determines wether the chip is disabled, or not.",
                            },
                            {
                                id: "clickable",
                                title: "Clickable",
                                type: "switch",
                                size: "small",
                                help: "Determines wether the chip is clickable, or not.",
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

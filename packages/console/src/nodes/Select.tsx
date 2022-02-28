import type { ReactElement } from "react";
import { useState } from "react";

import { FormControl, MenuItem, Select as MuiSelect } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type {
    Color,
    CraftComponent,
    SelectMargin,
    SelectSize,
    SelectVariant,
} from "../types";

interface Props {
    size?: SelectSize;
    menuItems?: string;
    autoWidth?: boolean;
    multiple?: boolean;
    variant?: SelectVariant;
    margin?: SelectMargin;
    color?: Color | string;

    startAdornment?: string;
    endAndornment?: string;
}

export const Select: CraftComponent<Props> = (props: Props): ReactElement => {
    const { menuItems, autoWidth, multiple, variant } = props;
    const menuItemsArray = menuItems?.trim()?.split(",");
    const [property, setProperty] = useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setProperty(typeof value === "string" ? value.split(",") : value);
    };

    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <FormControl variant={variant} sx={{ m: 1, minWidth: 120 }}>
                <MuiSelect
                    labelId="label-select-id"
                    id="select-id"
                    value={property}
                    onChange={handleChange}
                    autoWidth={autoWidth}
                    multiple={multiple}>
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {menuItemsArray?.map((item: string) => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </MuiSelect>
            </FormControl>
        </div>
    );
};

const defaultProps: Props = {
    size: "normal",
    menuItems: "",
    autoWidth: false,
    multiple: false,
    variant: "standard",
    margin: "normal",
    color: "inherit",

    startAdornment: "",
    endAndornment: "",
};

Select.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm
                groups={[
                    {
                        title: "General",
                        fields: [
                            {
                                id: "size",
                                size: "small",
                                help: "The size of the select.",
                                type: "select",
                                required: true,
                                title: "Size",
                                options: [
                                    { value: "small", title: "Small" },
                                    { value: "normal", title: "Normal" },
                                ],
                            },
                            {
                                id: "menuItems",
                                title: "Menu Items",
                                type: "large_text",
                                size: "small",
                                help: "List all the items of dropdown",
                            },
                            {
                                id: "autoWidth",
                                title: "Auto-Width",
                                type: "switch",
                                size: "small",
                                help: "Determines whether the auto-width is disabled, or not.",
                            },
                            {
                                id: "multiple",
                                title: "Multiple",
                                type: "switch",
                                size: "small",
                                help: "Determines wether the multiple is disabled, or not.",
                            },
                            {
                                id: "variant",
                                size: "small",
                                help: "The variant of the select.",
                                type: "select",
                                required: true,
                                title: "Variant",
                                options: [
                                    { value: "filled", title: "filled" },
                                    { value: "standard", title: "standard" },
                                    { value: "outlined", title: "outlined" },
                                ],
                            },
                            {
                                id: "margin",
                                title: "Margin",
                                type: "select",
                                required: true,
                                size: "small",
                                options: [
                                    { value: "none", title: "none" },
                                    { value: "dense", title: "dense" },
                                    { value: "normal", title: "normal" },
                                ],
                                help: "List all the margins of dropdown",
                            },
                            /*
                             * {
                             *     id: "color",
                             *     title: "Menu Items",
                             *     type: "large_text",
                             *     size: "small",
                             *     help: "List all the items of dropdown",
                             * },
                             */
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

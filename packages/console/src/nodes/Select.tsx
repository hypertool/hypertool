import type { ReactElement } from "react";
import { useState } from "react";

import { Select as MuiSelect } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";

import { useNode } from "@craftjs/core";

import PropertiesForm from "../layouts/app-builder/panels/properties-editor/PropertiesForm";
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
    const { menuItems, autoWidth, multiple, variant, margin, color, size } =
        props;
    const menuItemsArray = menuItems?.trim()?.split(",");
    const [age, setAge] = useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setAge(typeof value === "string" ? value.split(",") : value);
    };

    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <FormControl variant={variant} sx={{ m: 1, minWidth: 120 }}>
                <MuiSelect
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={age}
                    onChange={handleChange}
                    autoWidth={autoWidth}
                    multiple={multiple}
                >
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
    menuItems:
        "           abc, xyz, abdanfduoahfuaobefjbaufbweoibfadjkbfdwsvfwiyfb        ",
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
                                help: "The size of the button.",
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
                                help: "Determines whether the autoWidth is disabled, or not.",
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
                            // {
                            //     id: "color",
                            //     title: "Menu Items",
                            //     type: "large_text",
                            //     size: "small",
                            //     help: "List all the items of dropdown",
                            // },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

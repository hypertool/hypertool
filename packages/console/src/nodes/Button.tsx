import { CraftProps } from ".";
import { useNode } from "@craftjs/core";
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Button as MaterialButton,
    Radio,
    RadioGroup,
} from "@mui/material";
import { FunctionComponent, ReactElement } from "react";

interface ButtonProps {
    size?: string | number;
    variant?: "text" | "outlined" | "contained";
    color?: "primary" | "secondary";
    text: string;
    children?: ReactElement | any;
}

type CraftComponent<Props> = FunctionComponent<Props> & CraftProps;

export const Button: CraftComponent<ButtonProps> = (
    props: ButtonProps,
): ReactElement => {
    const {
        size = "small",
        variant = "contianed",
        color = "primary",
        text,
        children,
    } = props;

    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <MaterialButton
            ref={(ref) => connect(drag(ref as any))}
            size={size as any}
            variant={variant as any}
            color={color as any}
        >
            <div>{text}</div>
            {children}
        </MaterialButton>
    );
};

const ButtonSettings: FunctionComponent = (): ReactElement => {
    const {
        actions: { setProp },
        props,
    } = useNode((node) => ({
        props: node.data.props,
    }));

    return (
        <div>
            <FormControl size="small" component="fieldset">
                <FormLabel component="legend">Size</FormLabel>
                <RadioGroup
                    defaultValue={props.size}
                    onChange={(e) =>
                        setProp(
                            (props: { size: string }) =>
                                (props.size = e.target.value),
                        )
                    }
                >
                    <FormControlLabel
                        label="Small"
                        value="small"
                        control={<Radio size="small" color="primary" />}
                    />
                    <FormControlLabel
                        label="Medium"
                        value="medium"
                        control={<Radio size="small" color="primary" />}
                    />
                    <FormControlLabel
                        label="Large"
                        value="large"
                        control={<Radio size="small" color="primary" />}
                    />
                </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel component="legend">Variant</FormLabel>
                <RadioGroup
                    defaultValue={props.variant}
                    onChange={(e) =>
                        setProp(
                            (props: { variant: string }) =>
                                (props.variant = e.target.value),
                        )
                    }
                >
                    <FormControlLabel
                        label="Text"
                        value="text"
                        control={<Radio size="small" color="primary" />}
                    />
                    <FormControlLabel
                        label="Outlined"
                        value="outlined"
                        control={<Radio size="small" color="primary" />}
                    />
                    <FormControlLabel
                        label="Contained"
                        value="contained"
                        control={<Radio size="small" color="primary" />}
                    />
                </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
                <FormLabel component="legend">Color</FormLabel>
                <RadioGroup
                    defaultValue={props.color}
                    onChange={(e) =>
                        setProp(
                            (props: { color: string }) =>
                                (props.color = e.target.value),
                        )
                    }
                >
                    <FormControlLabel
                        label="Default"
                        value="default"
                        control={<Radio size="small" color="default" />}
                    />
                    <FormControlLabel
                        label="Primary"
                        value="primary"
                        control={<Radio size="small" color="primary" />}
                    />
                    <FormControlLabel
                        label="Seconday"
                        value="secondary"
                        control={<Radio size="small" color="primary" />}
                    />
                </RadioGroup>
            </FormControl>
        </div>
    );
};

Button.craft = {
    props: {
        size: "small",
        variant: "contained",
        color: "primary",
        text: "Click me",
    },
    related: {
        settings: ButtonSettings,
    },
};

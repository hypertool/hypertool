import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import Button, { ButtonProps } from "./Button";

export default {
    title: "Components/Button",
    component: Button,
    argTypes: {
        backgroundColor: { control: "color" },
    },
} as Meta;

// A master template for mapping props to render the Button component
const Template: Story<ButtonProps> = (props) => <Button {...props} />;

export const Primary = Template.bind({});
Primary.args = { label: "Primary", size: "large" };

export const Secondary = Template.bind({});
Secondary.args = { ...Primary.args, primary: false, label: "Secondary" };

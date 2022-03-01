import type { ReactElement } from "react";

import {
    FormControl,
    FormLabel,
    RadioGroup as MuiRadioGroup,
} from "@mui/material";

import { Element, useNode } from "@craftjs/core";

import { useArtifactReference } from "../hooks";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import type { CraftComponent, IArtifactReference } from "../types";

import { Radio } from "./Radio";

interface Props {
    label?: string;
    onChange?: IArtifactReference;
    row?: boolean;
    value?: string;
}

interface PartialRadioProps {
    children: ReactElement;
}

export const RadioGroupBottom: CraftComponent<PartialRadioProps> = (
    props: PartialRadioProps,
): ReactElement => {
    const {
        connectors: { connect },
    } = useNode();
    return <div ref={connect as any}>{props.children}</div>;
};

export const RadioGroup: CraftComponent<Props> = (
    props: Props,
): ReactElement => {
    const { value, label, row, onChange } = props;
    const handleChange = useArtifactReference(onChange);
    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
            <MuiRadioGroup
                row={row}
                aria-labelledby="demo-radio-buttons-group-label"
                value={value as any}
                name="radio-buttons-group"
                onChange={handleChange}
            >
                <Element id="radio" is={RadioGroupBottom} canvas={true}>
                    <Radio value={value} />
                </Element>
            </MuiRadioGroup>
        </FormControl>
    );
};

const defaultProps: Props = {
    label: "Label",
    onChange: undefined,
    row: false,
    value: "",
};

RadioGroup.defaultProps = defaultProps;

RadioGroup.craft = {
    props: defaultProps,
    related: {
        settings: () => (
            <PropertiesForm groups={[]} validationSchema={undefined} />
        ),
    },
};

RadioGroupBottom.craft = {
    rules: {
        canMoveIn: (incomingNodes: any) =>
            incomingNodes.every(
                (incomingNode: {
                    data: { type: ({ text }: any) => JSX.Element };
                }) => incomingNode.data.type === Radio,
            ),
    },
};

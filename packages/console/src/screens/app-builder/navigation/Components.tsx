import type { FunctionComponent, ReactElement } from "react";

import {
    Grid,
    Icon,
    Button as MaterialButton,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { Element, useEditor } from "../../../craft";
import {
    ButtonNode,
    CheckboxNode,
    FragmentNode,
    ImageNode,
    SelectNode,
    TextFieldNode,
    TextNode,
    ViewNode,
} from "../../../nodes";

const DecoratedGrid = styled(Grid)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const ToolName = styled(Typography)(() => ({
    fontSize: 14,
    fontWeight: "bold",
}));

const ItemButton = styled(MaterialButton)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(2),
    flexDirection: "column",
}));

const Components: FunctionComponent = (): ReactElement => {
    const { connectors } = useEditor();

    const components = [
        {
            title: "Button",
            icon: "format_shapes",
            createRef: (ref: any) => connectors.create(ref, <ButtonNode />),
        },
        {
            title: "Text",
            icon: "text_fields",
            createRef: (ref: any) => connectors.create(ref, <TextNode />),
        },
        {
            title: "Select",
            icon: "arrow_drop_down",
            createRef: (ref: any) => connectors.create(ref, <SelectNode />),
        },
        {
            title: "Checkbox",
            icon: "check_box",
            createRef: (ref: any) => connectors.create(ref, <CheckboxNode />),
        },
        {
            title: "View",
            icon: "square",
            createRef: (ref: any) =>
                connectors.create(ref, <Element is={ViewNode} canvas={true} />),
        },
        {
            title: "Fragment",
            icon: "extension",
            createRef: (ref: any) =>
                connectors.create(
                    ref,
                    <Element is={FragmentNode} canvas={true} />,
                ),
        },
        {
            title: "TextField",
            icon: "text_fields",
            createRef: (ref: any) => connectors.create(ref, <TextFieldNode />),
        },
        {
            title: "Image",
            icon: "image",
            createRef: (ref: any) => connectors.create(ref, <ImageNode />),
        },
    ];

    const renderComponent = (component: any) => (
        <Grid key={component.title} item={true} xs={6}>
            <ItemButton ref={component.createRef} variant="contained">
                <Icon fontSize="large">{component.icon}</Icon>
                {component.title}
            </ItemButton>
        </Grid>
    );

    return (
        <DecoratedGrid container={true} spacing={2}>
            <Grid item={true} xs={12}>
                <ToolName>Drag to add</ToolName>
            </Grid>
            {components.map(renderComponent)}
        </DecoratedGrid>
    );
};

export default Components;

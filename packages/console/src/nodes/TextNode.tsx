import { ReactElement, useCallback } from "react";
import { useEffect, useState } from "react";

import ContentEditable from "react-contenteditable";
import type { ContentEditableEvent } from "react-contenteditable";

import { useNode } from "../craft";
import PropertiesForm from "../screens/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

export interface ITextProps {
    id?: string;
    text?: string;
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontKerning?: string;
    fontStretch?: string;
    fontStyle?: string;
    fontWeight?: string;
}

const TextNode: CraftComponent<ITextProps> = (
    props: ITextProps,
): ReactElement => {
    const {
        connectors: { connect, drag },
        selected,
        actions: { setProp },
    } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
    }));
    const {
        text,
        color,
        fontFamily,
        fontSize,
        fontKerning,
        fontStretch,
        fontStyle,
        fontWeight,
    } = props as any;

    const [editable, setEditable] = useState(false);

    useEffect(() => {
        setEditable(!selected);
    }, [selected]);

    const handleChange = useCallback(
        (event: ContentEditableEvent) =>
            setProp((props: any) => {
                props.text = event.target.value;
            }),
        [],
    );

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <ContentEditable
                html={props.text || ""}
                onChange={handleChange}
                disabled={!editable}
                tagName="p"
                style={{
                    color,
                    fontFamily,
                    fontSize,
                    fontKerning,
                    fontStretch,
                    fontStyle,
                    fontWeight,
                }}
            />
        </div>
    );
};

TextNode.craft = {
    props: {
        text: "This is a sample text.",
        fontSize: "14px",
    },
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
                                help: "The identifier of the text.",
                                required: true,
                            },
                            {
                                id: "text",
                                title: "Text",
                                type: "text",
                                size: "small",
                                help: "The content of the text.",
                                required: true,
                            },
                        ],
                    },
                    {
                        id: "decoration",
                        title: "Decoration",
                        fields: [
                            {
                                id: "color",
                                title: "Color",
                                type: "text",
                                size: "small",
                                help: "The foreground color of the text.",
                            },
                        ],
                    },
                    {
                        id: "font",
                        title: "Font",
                        fields: [
                            {
                                id: "fontFamily",
                                title: "Font Family",
                                type: "text",
                                size: "small",
                                help: "The font family of the text.",
                            },
                            {
                                id: "fontSize",
                                title: "Font Size",
                                type: "text",
                                size: "small",
                                help: "The font size of the text.",
                            },
                            {
                                id: "fontKerning",
                                title: "Font Kerning",
                                type: "select",
                                size: "small",
                                help: "Sets the use of the kerning information stored in a font.",
                                options: [
                                    { value: "auto", title: "Auto" },
                                    { value: "normal", title: "Normal" },
                                    { value: "none", title: "None" },
                                ],
                            },
                            {
                                id: "fontStretch",
                                title: "Font Stretch",
                                type: "select",
                                size: "small",
                                help: "Selects a normal, condensed, or expanded face from a font.",
                                options: [
                                    { value: "normal", title: "Normal" },
                                    {
                                        value: "semi-condensed",
                                        title: "Semi Condensed",
                                    },
                                    { value: "condensed", title: "Condensed" },
                                    {
                                        value: "extra-condensed",
                                        title: "Extra Condensed",
                                    },
                                    {
                                        value: "ultra-condensed",
                                        title: "Ultra Condensed",
                                    },
                                    {
                                        value: "semi-expanded",
                                        title: "Semi Expanded",
                                    },
                                    { value: "expanded", title: "Expanded" },
                                    {
                                        value: "extra-expanded",
                                        title: "Extra Expanded",
                                    },
                                    {
                                        value: "ultra-expanded",
                                        title: "Ultra Expanded",
                                    },
                                ],
                            },
                            {
                                id: "fontStyle",
                                title: "Font Style",
                                type: "select",
                                size: "small",
                                help: "sets whether a font should be styled with a normal, italic, or oblique face from its font family.",
                                options: [
                                    { value: "normal", title: "Normal" },
                                    { value: "italic", title: "Italic" },
                                    { value: "oblique", title: "Oblique" },
                                ],
                            },
                            {
                                id: "fontWeight",
                                title: "Font Weight",
                                type: "select",
                                size: "small",
                                help: "Sets the weight of the font.",
                                options: [
                                    { value: "100", title: "Thin" },
                                    { value: "200", title: "Extra Light" },
                                    { value: "300", title: "Light" },
                                    { value: "400", title: "Normal" },
                                    { value: "500", title: "Medium" },
                                    { value: "600", title: "Semi Bold" },
                                    { value: "700", title: "Bold" },
                                    { value: "800", title: "Extra Bold" },
                                    { value: "900", title: "Black" },
                                    { value: "950", title: "Extra Black" },
                                ],
                            },
                        ],
                    },
                ]}
                validationSchema={undefined}
            />
        ),
    },
};

export default TextNode;

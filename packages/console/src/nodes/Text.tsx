import { ReactElement, useEffect, useState } from "react";

import { useNode } from "@craftjs/core";
import ContentEditable from "react-contenteditable";

import PropertiesForm from "../layouts/app-builder/panels/properties-editor/PropertiesForm";
import { CraftComponent } from "../types";

interface TextProps {
    text?: string;
    fontSize?: string | number;
}

export const Text: CraftComponent<TextProps> = (
    props: TextProps,
): ReactElement => {
    const {
        connectors: { connect, drag },
        selected,
        actions: { setProp },
    } = useNode((state) => ({
        selected: state.events.selected,
        dragged: state.events.dragged,
    }));

    const [editable, setEditable] = useState(false);

    useEffect(() => {
        if (!selected) {
            setEditable(false);
        } else {
            setEditable(true);
        }
    }, [selected]);

    return (
        <div ref={(ref) => connect(drag(ref as any))}>
            <ContentEditable
                html={props.text as any}
                onChange={(e) =>
                    setProp(
                        (props: { text: string }) =>
                            (props.text = e.target.value.replace(
                                /<\/?[^>]+(>|$)/g,
                                "",
                            )),
                    )
                }
                disabled={!editable}
                tagName="p"
                style={{ fontSize: `${props.fontSize}px` }}
            />
        </div>
    );
};

Text.craft = {
    props: {
        text: "Sample Text",
        fontSize: 20,
    },
    related: {
        settings: PropertiesForm,
    },
};

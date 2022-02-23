import { CraftProps } from ".";
import { useNode } from "@craftjs/core";
import { FormControl, FormLabel, Slider } from "@mui/material";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

interface TextProps {
    text?: string;
    fontSize?: string | number;
}

type CraftComponent<Props> = FunctionComponent<Props> & CraftProps;

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

const TextSettings: FunctionComponent = (): ReactElement => {
    const {
        actions: { setProp },
        fontSize,
    } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
    }));

    return (
        <>
            <FormControl size="small">
                <FormLabel component="legend">Font size</FormLabel>
                <Slider
                    defaultValue={fontSize}
                    step={1}
                    min={7}
                    max={50}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => {
                        setProp(
                            (props: { fontSize: number | number[] }) =>
                                (props.fontSize = value),
                        );
                    }}
                />
            </FormControl>
        </>
    );
};

Text.craft = {
    props: {
        text: "Sample Text",
        fontSize: 20,
    },
    related: {
        settings: TextSettings,
    },
};

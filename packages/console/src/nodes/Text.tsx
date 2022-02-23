import { useNode } from "@craftjs/core";
import { FormControl, FormLabel, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

export const Text = ({ text, fontSize }: any) => {
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
                html={text}
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
                style={{ fontSize: `${fontSize}px` }}
            />
        </div>
    );
};

const TextSettings = () => {
    const {
        actions: { setProp },
        fontSize,
    } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
    }));

    return (
        <>
            <FormControl className="text-additional-settings" size="small">
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

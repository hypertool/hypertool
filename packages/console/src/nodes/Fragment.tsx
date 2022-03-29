import { FunctionComponent, ReactElement } from "react";

import { FormControl, FormLabel, Paper, Slider } from "@mui/material";

import { useNode } from "../craft";
import { CraftComponent } from "../types";

interface FragmentProps {
    background?: string;
    padding?: string | number;
    children?: ReactElement | any;
}

export const Fragment: CraftComponent<FragmentProps> = (
    props: FragmentProps,
): ReactElement => {
    const {
        connectors: { connect, drag },
    } = useNode();
    const { background, padding, children } = props;

    return (
        <Paper
            ref={(ref: any) => connect(drag(ref as any))}
            style={{ background, padding: `${padding}px` }}
        >
            {children}
        </Paper>
    );
};

export const FragmentSettings: FunctionComponent = (): ReactElement => {
    const {
        padding,
        actions: { setProp },
    } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding,
    }));
    return (
        <div>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend">Padding</FormLabel>
                <Slider
                    defaultValue={padding}
                    onChange={(_, value) =>
                        setProp(
                            (props: { padding: number | number[] }) =>
                                (props.padding = value),
                        )
                    }
                />
            </FormControl>
        </div>
    );
};

export const FragmentDefaultProps = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    background: "#242424",
    margin: "8px",
};

Fragment.craft = {
    props: FragmentDefaultProps,
    related: {
        settings: FragmentSettings,
    },
};

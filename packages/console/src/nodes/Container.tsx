import { useNode } from "@craftjs/core";
import { FormControl, FormLabel, Slider, Paper } from "@mui/material";

export const Container = ({ background, padding = 0, children }: any) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <Paper
            ref={(ref: any) => connect(drag(ref as any))}
            style={{ background, padding: `${padding}px` }}>
            {children}
        </Paper>
    );
};

export const ContainerSettings = () => {
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

export const ContainerDefaultProps = {
    background: "#333",
    padding: 3,
};

Container.craft = {
    props: ContainerDefaultProps,
    related: {
        settings: ContainerSettings,
    },
};

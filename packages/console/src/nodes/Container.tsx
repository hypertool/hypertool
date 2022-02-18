import { useNode } from "@craftjs/core";
import { FormControl, FormLabel, Slider, Paper } from "@mui/material";
import ColorPicker from "material-ui-color-picker";

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
        background,
        padding,
        actions: { setProp },
    } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding,
    }));
    return (
        <div>
            <FormControl fullWidth={true} margin="normal" component="fieldset">
                <FormLabel component="legend">Background</FormLabel>
                <ColorPicker
                    defaultValue={background || "#000"}
                    onChange={(color: any) => {
                        setProp(
                            (props: { background: any }) =>
                                (props.background = color),
                        );
                    }}
                />
            </FormControl>
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

Container.craft = {
    related: {
        settings: ContainerSettings,
    },
};

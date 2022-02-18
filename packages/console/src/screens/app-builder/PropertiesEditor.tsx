import {
    Box,
    Chip,
    FormControl,
    FormLabel,
    Grid,
    Button as MaterialButton,
    Slider,
    Typography,
} from "@mui/material";
import { useEditor } from "@craftjs/core";
import React from "react";

const PropertiesEditor = () => {
    const { selected, actions } = useEditor((state, query) => {
        const currentNodeId: any = state.events.selected;
        let selected;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
                settings:
                    state.nodes[currentNodeId].related &&
                    state.nodes[currentNodeId].related.settings,
                isDeletable: query.node(currentNodeId).isDeletable(),
            };
        }

        return {
            selected,
        };
    });

    return (
        <>
            {selected && (
                <Box mt={2} px={2} py={2}>
                    <Grid container direction="column" spacing={0}>
                        <Grid item>
                            <Box pb={2}>
                                <Grid container alignItems="center">
                                    <Grid item xs>
                                        <Typography variant="subtitle1">
                                            Selected
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Chip
                                            size="small"
                                            color="primary"
                                            label="Selected"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        {selected.settings &&
                            React.createElement(selected.settings)}
                        <FormControl size="small" component="fieldset">
                            <FormLabel component="legend">Prop</FormLabel>
                            <Slider
                                defaultValue={0}
                                step={1}
                                min={7}
                                max={50}
                                valueLabelDisplay="auto"
                            />
                        </FormControl>
                        {selected.isDeletable && (
                            <MaterialButton
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    actions.delete(selected.id);
                                }}>
                                Delete
                            </MaterialButton>
                        )}
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default PropertiesEditor;

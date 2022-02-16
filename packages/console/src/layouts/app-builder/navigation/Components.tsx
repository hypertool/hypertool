import { Box, Typography, Grid, Button as MaterialButton } from "@mui/material";

const Components = () => {
    return (
        <Box px={2} py={2}>
            <Grid container={true} spacing={1}>
                <Box pb={2}>
                    <Typography>Drag to add</Typography>
                </Box>
                <Grid container direction="column" item>
                    <MaterialButton variant="contained">Button</MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton variant="contained">Text</MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton variant="contained">
                        Container
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton variant="contained">Card</MaterialButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Components;

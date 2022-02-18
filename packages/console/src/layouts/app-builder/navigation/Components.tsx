import { Element, useEditor } from "@craftjs/core";
import { Box, Grid, Button as MaterialButton, Typography } from "@mui/material";

import { Button, Card, Container, Text } from "../../../nodes";

const Components = () => {
    const { connectors } = useEditor();

    return (
        <Box px={2} py={2}>
            <Grid>
                <Box pb={2}>
                    <Typography>Drag to add</Typography>
                </Box>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) =>
                            connectors.create(
                                ref as any,
                                <Button text="Click me" size="small" />,
                            )
                        }
                        variant="contained"
                    >
                        Button
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) =>
                            connectors.create(
                                ref as any,
                                <Text text="Hi world" />,
                            )
                        }
                        variant="contained"
                    >
                        Text
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) =>
                            connectors.create(
                                ref as any,
                                <Element is={Container} padding={20} canvas />,
                            )
                        }
                        variant="contained"
                    >
                        Container
                    </MaterialButton>
                </Grid>
                <Grid container direction="column" item>
                    <MaterialButton
                        ref={(ref) => connectors.create(ref as any, <Card />)}
                        variant="contained"
                    >
                        Card
                    </MaterialButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Components;

import { Grid, Button as MaterialButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
    AddBoxOutlined,
    AddBoxTwoTone,
    FormatShapes,
    TextFields,
} from "@mui/icons-material";

import { Element, useEditor } from "@craftjs/core";

import { Button, Card, FlexLayout, Text, TextField } from "../../../nodes";

const ContianerGrid = styled(Grid)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const ToolName = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontWeight: "bold",
}));

const ItemButton = styled(MaterialButton)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(2),
    flexDirection: "column",
}));

const Components = () => {
    const { connectors } = useEditor();

    return (
        <ContianerGrid container={true} spacing={2}>
            <Grid item={true} xs={12}>
                <ToolName>Drag to add</ToolName>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) => connectors.create(ref as any, <Button />)}
                    variant="contained">
                    <FormatShapes fontSize="large" />
                    Button
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) => connectors.create(ref as any, <Text />)}
                    variant="contained">
                    <TextFields fontSize="large" />
                    Text
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) =>
                        connectors.create(
                            ref as any,
                            <Element is={FlexLayout} canvas={true} />,
                        )
                    }
                    variant="contained">
                    <AddBoxOutlined fontSize="large" />
                    Flex Layout
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) => connectors.create(ref as any, <Card />)}
                    variant="contained">
                    <AddBoxTwoTone fontSize="large" />
                    Card
                </ItemButton>
            </Grid>

            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) => connectors.create(ref as any, <TextField />)}
                    variant="contained">
                    <TextFields fontSize="large" />
                    Text Input
                </ItemButton>
            </Grid>
        </ContianerGrid>
    );
};

export default Components;

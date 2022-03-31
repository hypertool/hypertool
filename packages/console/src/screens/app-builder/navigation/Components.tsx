import { Grid, Button as MaterialButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
    AddBoxOutlined,
    AddBoxTwoTone,
    ArrowDropDownCircle,
    FormatShapes,
    TextFields,
} from "@mui/icons-material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { Element, useEditor } from "../../../craft";
import {
    Button,
    Card,
    Checkbox,
    FlexLayout,
    Fragment,
    Select,
    Text,
    ViewNode as View,
} from "../../../nodes";

const ContianerGrid = styled(Grid)(({ theme }) => ({
    padding: theme.spacing(2),
}));

const ToolName = styled(Typography)(() => ({
    fontSize: 14,
    fontWeight: "bold",
}));

const ItemButton = styled(MaterialButton)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(2),
    flexDirection: "column",
}));

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
                    variant="contained"
                >
                    <FormatShapes fontSize="large" />
                    Button
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) => connectors.create(ref as any, <Text />)}
                    variant="contained"
                >
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
                    variant="contained"
                >
                    <AddBoxOutlined fontSize="large" />
                    Flex Layout
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) => connectors.create(ref as any, <Card />)}
                    variant="contained"
                >
                    <AddBoxTwoTone fontSize="large" />
                    Card
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) => connectors.create(ref as any, <Select />)}
                    variant="contained"
                >
                    <ArrowDropDownCircle fontSize="large" />
                    Select
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) => connectors.create(ref as any, <Checkbox />)}
                    variant="contained"
                >
                    <CheckBoxIcon fontSize="large" />
                    Select
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) =>
                        ref &&
                        connectors.create(
                            ref,
                            <Element is={View} canvas={true} />,
                        )
                    }
                    variant="contained"
                >
                    <CheckBoxIcon fontSize="large" />
                    View
                </ItemButton>
            </Grid>
            <Grid item={true} xs={6}>
                <ItemButton
                    ref={(ref) =>
                        ref &&
                        connectors.create(
                            ref,
                            <Element is={Fragment} canvas={true} />,
                        )
                    }
                    variant="contained"
                >
                    <CheckBoxIcon fontSize="large" />
                    Fragment
                </ItemButton>
            </Grid>
        </ContianerGrid>
    );
};

export default Components;

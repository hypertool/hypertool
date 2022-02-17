import { AutoAwesomeMosaic, FormatAlignLeft } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

const DrawerHeader = styled("section")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).level1,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
}));

const DrawerTitle = styled("b")(({ theme }) => ({
    fontSize: 14,
}));

const Explorer: FunctionComponent = (): ReactElement => {
    const [alignment, setAlignment] = useState("builder");

    const handleChange = useCallback((event: any, newAlignment: any) => {
        setAlignment(newAlignment);
    }, []);

    return (
        <>
            <DrawerHeader>
                <DrawerTitle>Explorer</DrawerTitle>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive={true}
                    onChange={handleChange}
                >
                    <ToggleButton value="builder">
                        <AutoAwesomeMosaic fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="editor">
                        <FormatAlignLeft fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </DrawerHeader>
        </>
    );
};

export default Explorer;

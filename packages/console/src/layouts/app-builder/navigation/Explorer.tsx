import { AutoAwesomeMosaic, CodeOutlined } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const DrawerHeader = styled("section")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
}));

const DrawerTitle = styled("b")(({ theme }) => ({
    fontSize: 14,
}));

const Explorer: FunctionComponent = (): ReactElement => {
    const [mode, setMode] = useState("design");

    const handleChange = useCallback((event: any, newMode: any) => {
        setMode(newMode);
    }, []);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        navigate(location.pathname + "?mode=" + mode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    return (
        <>
            <DrawerHeader>
                <DrawerTitle>Explorer</DrawerTitle>
                <ToggleButtonGroup
                    color="primary"
                    value={mode}
                    exclusive={true}
                    onChange={handleChange}
                >
                    <ToggleButton value="design">
                        <AutoAwesomeMosaic fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="code">
                        <CodeOutlined fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </DrawerHeader>
        </>
    );
};

export default Explorer;

import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

import { TreeItem, TreeView } from "@mui/lab";
import { treeItemClasses } from "@mui/lab/TreeItem";

import {
    AutoAwesomeMosaic,
    ChevronRight,
    CodeOutlined,
    ExpandMore,
} from "@mui/icons-material";

import { CustomTreeItem } from ".";
import { useLocation, useNavigate } from "react-router";

const DrawerHeader = styled("section")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
}));

const DrawerTitle = styled("b")(({ theme }) => ({
    fontSize: 14,
}));

const StyledTreeItem = styled((props: any) => (
    <TreeItem {...props} CustomContent={CustomTreeItem} />
))(({ theme }: any) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        "& .close": {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 0,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
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
    }, [location.pathname, mode, navigate]);

    return (
        <>
            <DrawerHeader>
                <DrawerTitle>Explorer</DrawerTitle>
                <ToggleButtonGroup
                    color="primary"
                    value={mode}
                    exclusive={true}
                    onChange={handleChange}
                    size="small"
                >
                    <ToggleButton value="design">
                        <AutoAwesomeMosaic fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="code">
                        <CodeOutlined fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </DrawerHeader>
            <TreeView
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ChevronRight />}
                sx={{
                    height: 240,
                    flexGrow: 1,
                    maxWidth: 400,
                    overflowY: "auto",
                }}
            >
                <StyledTreeItem nodeId="1" label="Applications">
                    <StyledTreeItem nodeId="2" label="Calendar" />
                    <StyledTreeItem nodeId="3" label="Chrome" />
                    <StyledTreeItem nodeId="4" label="Webstorm" />
                </StyledTreeItem>
                <StyledTreeItem nodeId="5" label="Documents">
                    <StyledTreeItem nodeId="10" label="OSS" />
                    <StyledTreeItem nodeId="6" label="MUI">
                        <StyledTreeItem nodeId="7" label="src">
                            <StyledTreeItem nodeId="8" label="index.js" />
                            <StyledTreeItem nodeId="9" label="tree-view.js" />
                        </StyledTreeItem>
                    </StyledTreeItem>
                </StyledTreeItem>
            </TreeView>
        </>
    );
};

export default Explorer;

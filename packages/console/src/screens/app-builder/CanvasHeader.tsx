import { useCallback } from "react";

import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CheckBox, Edit, Redo, Undo } from "@mui/icons-material";

import { useEditor } from "@craftjs/core";

const Header = styled("div")(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(1),
    backgroundColor: (theme.palette.background as any).paper1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}));

const HelperText = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
}));

const CanvasHeader = () => {
    const { enabled, canUndo, canRedo, actions } = useEditor(
        (state, query) => ({
            enabled: state.options.enabled,
            canUndo: query.history.canUndo(),
            canRedo: query.history.canRedo(),
        }),
    );

    const handleUndo = useCallback(() => {
        actions.history.undo();
    }, [actions.history]);

    const handleRedo = useCallback(() => {
        actions.history.redo();
    }, [actions.history]);

    return (
        <Header>
            {enabled && (
                <div>
                    <Tooltip title="Undo" placement="bottom">
                        <IconButton disabled={!canUndo} onClick={handleUndo}>
                            <Undo />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Redo" placement="bottom">
                        <IconButton disabled={!canRedo} onClick={handleRedo}>
                            <Redo />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
            <div>
                <Button
                    onClick={() => {
                        actions.setOptions(
                            (options) => (options.enabled = !enabled),
                        );
                    }}
                >
                    {enabled ? (
                        <CheckBox fontSize="small" />
                    ) : (
                        <Edit fontSize="small" />
                    )}
                    <HelperText>{enabled ? "Finish" : "Edit"}</HelperText>
                </Button>
            </div>
        </Header>
    );
};

export default CanvasHeader;

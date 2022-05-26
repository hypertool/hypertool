import type { FunctionComponent, ReactElement } from "react";

import { Box, Dialog as MuiDialog } from "@mui/material";

import { ISymbolReference } from "../types";

export interface IDialogProps {
    id?: string;
    open: boolean;
    disableEscapeKeyDown?: boolean;
    fullScreen?: boolean;
    fullWidth?: boolean;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
    onClose?: ISymbolReference;
    scroll?: "body" | "paper";
    transition?: "collapse" | "fade" | "grow" | "slide" | "zoom";
    children?: ReactElement;
}

const Dialog: FunctionComponent<IDialogProps> = (
    props: IDialogProps,
): ReactElement => {
    const { children } = props;
    return (
        <Box
            sx={{ boxShadow: 24 }}
            style={{
                minWidth: 400,
                minHeight: 200,
                width: "fit-content",
                height: "fit-content",
                backgroundColor: "white",
            }}
        >
            {children}
        </Box>
    );
};

export default Dialog;

import type { FunctionComponent, ReactElement } from "react";

import {
  Collapse,
  Dialog as MuiDialog,
  Fade,
  Grow,
  Slide,
  Zoom,
} from "@mui/material";

import { ISymbolReference } from "../types";
import { useCallbackSymbol } from "../hooks";

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

type TOnClose = () => void;

const componentByTransition: Record<string, any> = {
  collapse: Collapse,
  fade: Fade,
  grow: Grow,
  slide: Slide,
  zoom: Zoom,
};

const Dialog: FunctionComponent<IDialogProps> = (
  props: IDialogProps
): ReactElement => {
  const {
    id,
    open,
    disableEscapeKeyDown,
    fullScreen,
    fullWidth,
    maxWidth,
    onClose,
    scroll,
    transition,
    children,
  } = props;
  const onCloseSymbol: TOnClose = useCallbackSymbol<TOnClose>(onClose);

  return (
    <MuiDialog
      id={`hypertool-${id}`}
      open={open}
      disableEscapeKeyDown={disableEscapeKeyDown}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth === "none" ? false : maxWidth}
      onClose={onCloseSymbol}
      scroll={scroll}
      TransitionComponent={transition && componentByTransition[transition]}
    >
      {children}
    </MuiDialog>
  );
};

export default Dialog;

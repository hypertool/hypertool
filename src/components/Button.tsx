import {
  FunctionComponent,
  MouseEvent,
  ReactElement,
  useCallback,
} from "react";
import useCallbackSymbol from "../hooks/useCallbackSymbol";
import type { INode, ISymbolReference, TMouseEventHandler } from "../types";
import { Button as MuiButton } from "@mui/material";
import { transformNativeMouseEvent } from "../utils/events";

export interface IProps {
  size?: string;
  variant?: string;
  disabled?: boolean;
  disableElevation?: boolean;
  disableFocusRipple?: boolean;
  disableRipple?: boolean;
  text?: string;
  onClick?: ISymbolReference;
  node: INode;
}

type TOnClick = () => void;

const Button: FunctionComponent<IProps> = (props: IProps): ReactElement => {
  const {
    size,
    variant,
    disabled,
    disableElevation,
    disableFocusRipple,
    disableRipple,
    text,
    onClick,
    node,
  } = props;
  const onClickSymbol: TMouseEventHandler<INode> =
    useCallbackSymbol<TOnClick>(onClick);
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClickSymbol(transformNativeMouseEvent(event, node));
    },
    [node, onClickSymbol]
  );

  return (
    <MuiButton
      size={size as any}
      variant={variant as any}
      disabled={disabled}
      disableElevation={disableElevation}
      disableFocusRipple={disableFocusRipple}
      disableRipple={disableRipple}
      onClick={handleClick}
    >
      {text}
    </MuiButton>
  );
};

export default Button;

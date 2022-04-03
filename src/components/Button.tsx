import { FunctionComponent, ReactElement } from "react";
import useCallbackSymbol from "../hooks/useCallbackSymbol";
import type { ISymbolReference } from "../types";
import { Button as MuiButton } from "@mui/material";

export interface IProps {
  size?: string;
  variant?: string;
  disabled?: boolean;
  disableElevation?: boolean;
  disableFocusRipple?: boolean;
  disableRipple?: boolean;
  text?: string;
  onClick?: ISymbolReference;
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
  } = props;
  const handleClick = useCallbackSymbol<TOnClick>(onClick);

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

import { FunctionComponent, ReactElement } from "react";
import useCallbackSymbol from "../hooks/useCallbackSymbol";
import type { ISymbolReference } from "../types";

export interface IProps {
  text?: string;
  onClick?: ISymbolReference;
}

type TOnClick = () => void;

const Button: FunctionComponent<IProps> = (props: IProps): ReactElement => {
  const { text, onClick } = props;
  const handleClick = useCallbackSymbol<TOnClick>(onClick);

  return <button onClick={handleClick}>{text}</button>;
};

export default Button;

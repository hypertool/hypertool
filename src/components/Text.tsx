import { FunctionComponent, ReactElement } from "react";

export interface ITextProps {
  id?: string;
  text?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontKerning?: string;
  fontStretch?: string;
  fontStyle?: string;
  fontWeight?: string;
}

const Text: FunctionComponent<ITextProps> = (
  props: ITextProps
): ReactElement => {
  const {
    text,
    color,
    fontFamily,
    fontSize,
    fontKerning,
    fontStretch,
    fontStyle,
    fontWeight,
  } = props as any;
  return (
    <p
      style={{
        color,
        fontFamily,
        fontSize,
        fontKerning,
        fontStretch,
        fontStyle,
        fontWeight,
      }}
    >
      {text}
    </p>
  );
};

export default Text;

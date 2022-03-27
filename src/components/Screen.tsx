import type { FunctionComponent, ReactElement } from "react";
import { useMemo } from "react";

import { inflateDocument } from "../utils";
import View from "./View";

export interface IProps {
  slug: string;
  title: string;
  content: string;
}

const Screen: FunctionComponent<IProps> = (props: IProps): ReactElement => {
  const { content } = props;

  const rootNode = useMemo(
    () => inflateDocument(JSON.parse(content)),
    [content]
  );

  return <View node={rootNode} />;
};

export default Screen;

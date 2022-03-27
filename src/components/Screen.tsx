import type { FunctionComponent, ReactElement } from "react";
import { useMemo, useEffect } from "react";

import { inflateDocument } from "../utils";
import View from "./View";

export interface IProps {
  slug: string;
  title: string;
  content: string;
}

const Screen: FunctionComponent<IProps> = (props: IProps): ReactElement => {
  const { content, title } = props;

  const rootNode = useMemo(
    () => inflateDocument(JSON.parse(content)),
    [content]
  );

  useEffect(() => {
    document.title = title;
  }, [title]);

  return <View node={rootNode} />;
};

export default Screen;

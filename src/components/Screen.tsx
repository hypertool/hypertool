import produce from "immer";
import { FunctionComponent, ReactElement, useRef } from "react";
import { useState, useMemo, useEffect } from "react";
import { ScreenContext } from "../contexts";
import { INode, IPatch } from "../types";

import { inflateDocument } from "../utils";
import ComponentRenderer from "./ComponentRenderer";

export interface IProps {
  slug: string;
  title: string;
  content: string;
  controller: string;
}

const Screen: FunctionComponent<IProps> = (props: IProps): ReactElement => {
  const { content, title, controller: patched } = props;
  const [state, setState] = useState<any>({});
  const refs = useRef<Record<string, any>>({});

  const rawRootNode = useMemo(
    () => inflateDocument(JSON.parse(content)),
    [content]
  );

  const controller = useMemo((): any => {
    // eslint-disable-next-line no-eval
    return eval(`"use strict"; (${patched});`);
  }, [patched]);

  const context = useMemo(
    (): any => ({
      refs: refs.current,

      setState: (stateOrName: Partial<any> | string, value?: any): void => {
        setState((state: any) => {
          if (typeof stateOrName === "string") {
            return {
              ...state,
              [stateOrName]: value,
            };
          }
          return { ...state, ...stateOrName };
        });
      },

      inflate: (id: string, patches?: Record<string, IPatch>): INode => {
        const fragment = rawRootNode.children.find(
          (node) => node.props.id === id
        );

        if (!fragment) {
          throw new Error(`Cannot find fragment with ID "${id}".`);
        }
        if (fragment.type !== "Fragment") {
          throw new Error(
            `Found node of type "${fragment.type}", expected "Fragment".`
          );
        }

        return produce(fragment, (draft) => {
          /* A shallow copy of the patches object is sufficient because only the keys
           * are removed.
           */
          const alteredPatches = { ...patches };

          const applyPatches = (node: INode) => {
            for (let i = 0; i < node.children.length; i++) {
              const child = node.children[i];
              const childPropId = child.props.id;
              if (childPropId && childPropId in alteredPatches) {
                const patch = alteredPatches[childPropId];
                if (patch.__hyperNode) {
                  node.children[i] = patch as any;
                } else {
                  child.props = { ...child.props, ...patch };
                }

                delete alteredPatches[childPropId];
                applyPatches(child);
              }
            }
          };

          applyPatches(draft);
        });
      },
    }),
    [rawRootNode.children]
  );

  useEffect(() => {
    if (controller.init) {
      controller.init(context);
    }
  }, [context, controller]);

  const rootNode: INode | null = useMemo(() => {
    if (controller.render) {
      const result = controller.render({ ...context, state });
      return result;
    }

    return context.inflate("default", {});
  }, [controller, context, state]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <ScreenContext.Provider
      value={{
        ...context,
        state,
      }}
    >
      <ComponentRenderer node={rootNode!} />
    </ScreenContext.Provider>
  );
};

export default Screen;

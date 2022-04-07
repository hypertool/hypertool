import produce from "immer";
import { FunctionComponent, ReactElement, useRef } from "react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation, useParams } from "react-router-dom";

import { ScreenContext } from "../contexts";
import { IHyperContext, ILocation, INode, IPatch } from "../types";

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
  const [searchParams, setQueryParams] = useSearchParams();
  const location = useLocation();
  const refs = useRef<Record<string, any>>({});
  const pathParams: Record<string, string | undefined> = useParams();

  const queryParams = useMemo(
    () => Object.fromEntries(searchParams),
    [searchParams]
  );

  const rawRootNode = useMemo(
    () => inflateDocument(JSON.parse(content)),
    [content]
  );

  const controller = useMemo((): any => {
    // eslint-disable-next-line no-eval
    return eval(`"use strict"; (${patched});`);
  }, [patched]);

  const context: IHyperContext<any> = useMemo(
    () => ({
      location: {
        path: location.pathname,
        query: location.search,
        hash: location.hash,
        state: location.state,
        key: location.key,
        pathParams,
        queryParams,
      },

      state,

      refs: refs.current,

      setQueryParams,

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
                /* Ignore null, undefined, true, and false values in place of nodes. */
                if (!["null", "undefined", "boolean"].includes(typeof patch)) {
                  if (patch.__hyperNode) {
                    node.children[i] = patch as any;
                  } else {
                    child.props = { ...child.props, ...patch };
                  }
                }

                delete alteredPatches[childPropId];
              }
              applyPatches(child);
            }
          };

          applyPatches(draft);
        });
      },
    }),
    [
      location,
      pathParams,
      queryParams,
      rawRootNode.children,
      setQueryParams,
      state,
    ]
  );

  const invokedInit = useRef(false);

  useEffect(() => {
    if (controller.init && !invokedInit.current) {
      controller.init(context);
      invokedInit.current = true;
    }
  }, [context, controller]);

  const rootNode: INode | null = useMemo(() => {
    if (controller.render) {
      const result = controller.render(context);
      return result;
    }

    return context.inflate("default", {});
  }, [controller, context]);

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

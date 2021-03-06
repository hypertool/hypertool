import cloneDeep from "lodash.clonedeep";
import produce from "immer";
import { FunctionComponent, ReactElement, useRef } from "react";
import { useState, useMemo, useEffect } from "react";
import {
  useSearchParams,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";

import { ScreenContext } from "../contexts";
import { useExecuteQuery } from "../hooks";
import {
  IHyperContext,
  INavigateOptions,
  INode,
  IPatch,
  TQueryResultFormat,
  TNavigationTarget,
  TMapCallbackFunction,
  TTransformNodeFunction,
  TPatchEntry,
} from "../types";

import { inflateDocument, truthy } from "../utils";
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
  const [searchParams, setQueryParams] = useSearchParams();
  const location = useLocation();
  const pathParams: Record<string, string | undefined> = useParams();
  const navigateNative = useNavigate();
  const { executeQuery } = useExecuteQuery();

  const navigate = useMemo(
    () => (target: TNavigationTarget | number, options?: INavigateOptions) => {
      if (typeof target === "number") {
        navigateNative(target);
      } else {
        navigateNative(
          typeof target === "string"
            ? target
            : {
                pathname: target.path,
                search: target.query,
                hash: target.hash,
              },
          options
        );
      }
    },
    [navigateNative]
  );

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

      navigate,

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

      applyPatches: (node: INode, patches: Record<string, IPatch>): INode =>
        produce(node, (draft) => {
          /* A shallow copy of the patches object is sufficient because only the keys
           * are removed.
           */
          const alteredPatches = { ...patches };

          if ("$" in alteredPatches) {
            const patch = alteredPatches.$;
            if (patch.__hyperNode) {
              throw new Error(
                `"$" symbol should be used only for patching props; cannot replace root node.`
              );
            }

            node.props = { ...node.props, ...patch };

            /* Remove the $ symbol from the patches object to prevent
             * duplicate efforts.
             */
            delete alteredPatches.$;
          }

          const applyPatches = (node: INode) => {
            for (let i = 0; i < node.children.length; i++) {
              const child = node.children[i];
              const childPropId = child.props.id;
              if (childPropId && childPropId in alteredPatches) {
                const patch: TPatchEntry = alteredPatches[childPropId];
                /* Ignore null, undefined, true, and false values in place of nodes. */
                if (!["undefined", "boolean"].includes(typeof patch)) {
                  /* For array children, we insert a patch that wraps the array. */
                  if (Array.isArray(patch)) {
                    node.children[i] = {
                      /* The internal ID is generated by Hypertool on the fly. */
                      internalId: `${node.internalId}--${i}`,
                      type: "Fragment",

                      /* The array can contain nodes, functions, null, undefined, and boolean values.
                       * Therefore, we loop through each item and derive new children.
                       */
                      children: (patch as (INode | TTransformNodeFunction)[])
                        .map((node) => {
                          switch (typeof node) {
                            case "function":
                              return (node as TTransformNodeFunction)(child);

                            case "object": {
                              /* Since JavaScript returns "object" for null values, we need to
                               * handle null values here.
                               */
                              if (node === null) {
                                return null;
                              }

                              if (Array.isArray(node)) {
                                throw new Error(
                                  "Nested arrays are not supported."
                                );
                              }
                              if (!node.__hyperNode) {
                                throw new Error(
                                  "Object cannot be rendered as node."
                                );
                              }
                              return node;
                            }

                            case "undefined":
                            case "boolean": {
                              return null;
                            }

                            default: {
                              throw new Error(
                                `Invalid child type "${typeof node}"; valid types include null, undefined, boolean, nodes, functions, and arrays.`
                              );
                            }
                          }
                        })
                        .filter(truthy),
                      props: {},
                      __hyperNode: true,
                    };
                  } else if (typeof patch === "function") {
                    node.children[i] = (patch as TTransformNodeFunction)(child);
                    console.log(node.children[i]);
                  } else {
                    if (patch.__hyperNode) {
                      node.children[i] = patch as unknown as INode;
                    } else {
                      /* Use both the properties from the patch and
                       * the child node (that is, from the markup).
                       */
                      child.props = { ...child.props, ...patch };
                    }
                  }
                }

                delete alteredPatches[childPropId];
              }
              applyPatches(child);
            }
          };

          applyPatches(draft);
        }),

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

        return context.applyPatches(fragment, patches || {});
      },

      map: <T,>(
        items: T[],
        callback: TMapCallbackFunction<T>
      ): TTransformNodeFunction[] => {
        const result = items.map((item) => {
          const patches = callback(item);

          return (template: INode): INode => {
            const duplicate = cloneDeep(template);
            duplicate.internalId = `${duplicate.internalId}--${(
              Math.random() * 10000
            ).toString()}`;

            return context.applyPatches(duplicate, patches);
          };
        });
        return result;
      },

      query: async (
        name: string,
        variables: Record<string, any> | any[] = {},
        format: TQueryResultFormat = "object"
      ): Promise<any> => {
        return await executeQuery({
          variables: {
            name,
            variables,
            format,
          },
        });
      },
    }),
    [
      executeQuery,
      location.hash,
      location.key,
      location.pathname,
      location.search,
      location.state,
      navigate,
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

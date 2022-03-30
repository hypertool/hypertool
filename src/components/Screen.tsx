import produce from "immer";
import type { FunctionComponent, ReactElement } from "react";
import { useState, useMemo, useEffect } from "react";
import {
  HyperNode,
  IHyperContext,
  IHyperController,
  INode,
  IPatch,
} from "../types";

import { inflateDocument } from "../utils";
import View from "./View";

export interface IProps {
  slug: string;
  title: string;
  content: string;
  controller: string;
}

type TCreateContext = <S>(controller: IHyperController<S>) => IHyperContext<S>;

const Screen: FunctionComponent<IProps> = (props: IProps): ReactElement => {
  const { content, title, controller } = props;
  const [error, setError] = useState<Error>();
  const [state, setState] = useState<any>();

  const rawRootNode = useMemo(
    () => inflateDocument(JSON.parse(content)),
    [content]
  );

  const createContext = useMemo<TCreateContext>(
    () =>
      <S,>(controller: IHyperController<S>): IHyperContext<S> => ({
        refs: {},

        setState: (
          stateOrName: Partial<S> | string,
          value?: S[keyof S]
        ): void => {
          setState((state: S) => {
            if (typeof stateOrName === "string") {
              return {
                ...state,
                [stateOrName]: value,
              };
            }
            return { ...state, ...stateOrName };
          });
        },

        getState: (name?: string): any => {
          if (name) {
            return state[name];
          }
          return state;
        },

        inflate: (id: string, patches?: Record<string, IPatch>): INode => {
          const fragment = rawRootNode.children.find((node) => node.internalId === id);
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
                if (child.internalId in alteredPatches) {
                  const patch = alteredPatches[child.internalId];
                  if (patch instanceof HyperNode) {
                    node.children[i] = patch;
                  } else {
                    child.props = patch;
                  }

                  delete alteredPatches[child.internalId];
                  applyPatches(child);
                }
              }
            };

            applyPatches(draft);
          });
        },
      }),
    [rawRootNode, state]
  );

  const rootNode: INode | null = useMemo(() => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(controller);
      if (result.render) {
        const context = createContext(result);
        return result.render(context);
      }

      return rawRootNode;
    } catch (error: unknown) {
      setError(error as Error);
      console.log(error);
    }

    return null;
  }, [controller, createContext, rawRootNode]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      {error && <div>{error.toString()}</div>}
      {!error && <View node={rootNode!} />}
    </>
  );
};

export default Screen;

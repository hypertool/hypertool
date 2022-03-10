import { createContext } from "react";

import { TEditorStore } from "./store";

export type EditorContext = TEditorStore;
export const EditorContext = createContext<EditorContext>(null as any);

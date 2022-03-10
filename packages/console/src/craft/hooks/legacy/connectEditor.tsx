import React from "react";

import { IEditorState } from "../../interfaces";
import { useEditor } from "../useEditor";

export function connectEditor<C>(collect?: (state: IEditorState) => C) {
    return (WrappedComponent: React.ElementType) => {
        return (props: any) => {
            const Editor = collect ? useEditor(collect) : useEditor();
            return <WrappedComponent {...Editor} {...props} />;
        };
    };
}

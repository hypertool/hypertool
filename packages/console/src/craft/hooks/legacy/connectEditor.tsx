import React from "react";

import { IEditorState } from "../../interfaces";
import { useEditor } from "../useEditor";

export function connectEditor<C>(collect?: (state: IEditorState) => C) {
    return (WrappedComponent: React.ElementType) => {
        return (props: any) => {
            const Editor = collect ? useEditor(collect) : useEditor();
            const WrappedComponent0 = WrappedComponent as any;
            return <WrappedComponent0 {...Editor} {...props} />;
        };
    };
}

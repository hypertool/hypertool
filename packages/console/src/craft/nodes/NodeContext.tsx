import React from "react";

import { TNodeID } from "../interfaces";

export type NodeContextType = {
    id: TNodeID;
    related?: boolean;
};

export const NodeContext = React.createContext<NodeContextType>(null as any);

export type NodeProviderProps = Omit<NodeContextType, "connectors">;

export const NodeProvider: React.FC<NodeProviderProps> = ({
    id,
    related = false,
    children,
}) => {
    return (
        <NodeContext.Provider value={{ id, related }}>
            {children}
        </NodeContext.Provider>
    );
};

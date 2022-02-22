import React from "react";

import { Icon } from "@mui/material";

import { useEditor } from "@craftjs/core";
import styled from "styled-components";

import { useLayer } from "../useLayer";

import { EditableLayerName } from "./EditableLayerName";

const StyledDiv = styled.div<{ selected: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 16px;
    background: ${(props) => (props.selected ? "#2680eb" : "transparent")};
    color: ${(props) => (props.selected ? "#fff" : "inherit")};
`;

const Inner = styled.div<{ depth: number }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px;
    width: 100%;

    div.layer-name {
        flex: 1;
        h2 {
            font-size: 12px;
        }
    }
`;

const Left = styled.div`
    display: flex;
`;

export const DefaultLayerHeader: React.FC = () => {
    const {
        id,
        depth,
        expanded,
        children,
        connectors: { drag, layerHeader },
        actions: { toggleLayer },
    } = useLayer((layer) => {
        return {
            expanded: layer.expanded,
        };
    });

    const { hidden, actions, selected, topLevel } = useEditor(
        (state, query) => {
            // TODO: handle multiple selected elements
            const selected = query.getEvent("selected").first() === id;

            return {
                hidden: state.nodes[id] && state.nodes[id].data.hidden,
                selected,
                topLevel: query.node(id).isTopLevelCanvas(),
            };
        },
    );

    return (
        <StyledDiv selected={selected} ref={drag}>
            <Icon
                onClick={() => actions.setHidden(id, !hidden)}
                style={{ fontSize: 16, marginRight: 8 }}
                fontSize="small"
            >
                {hidden ? "visibility_off" : "visibility"}
            </Icon>

            <Inner ref={layerHeader} depth={depth}>
                <Left>
                    {topLevel ? (
                        <Icon style={{ fontSize: 16 }} fontSize="small">
                            open_in_new
                        </Icon>
                    ) : null}

                    <div className="layer-name s">
                        <EditableLayerName />
                    </div>
                </Left>

                {children && children.length ? (
                    <Icon
                        style={{ fontSize: 16 }}
                        fontSize="small"
                        onMouseDown={() => toggleLayer()}
                    >
                        {expanded ? "expand_less" : "expand_more"}
                    </Icon>
                ) : null}
            </Inner>
        </StyledDiv>
    );
};

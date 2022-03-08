/* eslint-disable no-undef */
import React, { useCallback, useEffect, useRef } from "react";

import { styled } from "@mui/material/styles";

import { ArrowUpward, ControlCamera, Delete } from "@mui/icons-material";

import { useEditor, useNode } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import ReactDOM from "react-dom";

const Indicator = styled("div")(({ theme }) => ({
    height: theme.spacing(4),
    fontSize: 10,
    lineHeight: 12,
    color: "white",
    backgroundColor: "#f00",
    padding: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
    position: "absolute",
}));

const IndicatorText = styled("div")(() => ({
    marginRight: 8,
    fontSize: 16,
}));

const Button = styled("a")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    opacity: 0.9,
    marginRight: theme.spacing(1),
}));

interface IRenderNodeProps {
    render: any;
}

export const RenderNode = (props: IRenderNodeProps) => {
    const { render } = props;
    const { id } = useNode();
    const { actions, query, isActive } = useEditor((_, query) => ({
        isActive: query.getEvent("selected").contains(id),
    }));

    const {
        isHover,
        dom,
        name,
        moveable,
        deletable,
        connectors: { drag },
        parent,
    } = useNode((node) => ({
        isHover: node.events.hovered,
        dom: node.dom,
        name: node.data.custom.displayName || node.data.displayName,
        moveable: query.node(node.id).isDraggable(),
        deletable: query.node(node.id).isDeletable(),
        parent: node.data.parent,
        props: node.data.props,
    }));

    const currentRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (dom) {
            if (isActive || isHover) dom.classList.add("component-selected");
            else dom.classList.remove("component-selected");
        }
    }, [dom, isActive, isHover]);

    const getPos = useCallback((dom: HTMLElement) => {
        const { top, left, bottom } = dom
            ? dom.getBoundingClientRect()
            : { top: 0, left: 0, bottom: 0 };
        return {
            top: `${(top > 0 ? top : bottom) - 30}px`,
            left: `${left}px`,
        };
    }, []);

    const scroll = useCallback(() => {
        const { current: currentDOM } = currentRef;
        if (!currentDOM) return;
        const { top, left } = getPos(dom as any);
        currentDOM.style.top = top;
        currentDOM.style.left = left;
    }, [dom, getPos]);

    useEffect(() => {
        if ((document as any).querySelector(".craftjs-renderer")) {
            (document as any)
                .querySelector(".craftjs-renderer")
                .addEventListener("scroll", scroll);

            return () => {
                (document as any)
                    .querySelector(".craftjs-renderer")
                    .removeEventListener("scroll", scroll);
            };
        }
    }, [scroll]);

    return (
        <div style={{ position: "relative" }}>
            {isHover || isActive
                ? ReactDOM.createPortal(
                      <Indicator
                          ref={currentRef as any}
                          style={{
                              left: getPos(dom as any).left,
                              top: getPos(dom as any).top,
                              zIndex: 9999,
                          }}>
                          {moveable ? (
                              <Button ref={drag as any}>
                                  <ControlCamera fontSize="small" />
                              </Button>
                          ) : null}
                          {id !== ROOT_NODE && (
                              <Button
                                  onClick={() => {
                                      actions.selectNode(parent);
                                  }}>
                                  <ArrowUpward fontSize="small" />
                              </Button>
                          )}
                          {deletable ? (
                              <Button
                                  onMouseDown={(event: React.MouseEvent) => {
                                      event.stopPropagation();
                                      actions.delete(id);
                                  }}>
                                  <Delete fontSize="small" />
                              </Button>
                          ) : null}
                          <IndicatorText>{name}</IndicatorText>
                      </Indicator>,
                      (document as any).querySelector(".page-container"),
                  )
                : null}
            {render}
        </div>
    );
};

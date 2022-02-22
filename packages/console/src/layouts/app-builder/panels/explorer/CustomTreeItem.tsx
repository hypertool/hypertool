import type { ForwardRefRenderFunction, ReactElement, ReactNode } from "react";
import { forwardRef } from "react";

import { Typography } from "@mui/material";

import { useTreeItem } from "@mui/lab/TreeItem";

import clsx from "clsx";

export interface Props {
    classes: any;
    className: string;
    label: string;
    nodeId: string;
    icon: ReactNode;
    children?: ReactNode;
}

const CustomTreeItem: ForwardRefRenderFunction<Props, any> = (
    props: Props,
    ref: any,
): ReactElement => {
    const { classes, className, label, nodeId, icon } = props;

    const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        handleSelection,
        preventSelection,
    } = useTreeItem(nodeId);

    const handleMouseDown = (event: any) => {
        preventSelection(event);
    };

    const handleExpansionClick = (event: any) => {
        handleExpansion(event);
    };

    const handleSelectionClick = (event: any) => {
        handleSelection(event);
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={clsx(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            })}
            style={{ width: "100%" }}
            onMouseDown={handleMouseDown}
            ref={ref}
        >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div
                onClick={handleExpansionClick}
                className={classes.iconContainer}
            >
                {icon}
            </div>
            <Typography
                onClick={handleSelectionClick}
                component="div"
                className={classes.label}
            >
                {label}
            </Typography>
        </div>
    );
};

export default forwardRef(CustomTreeItem);

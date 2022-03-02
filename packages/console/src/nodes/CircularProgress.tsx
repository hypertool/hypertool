import type { FunctionComponent, ReactElement } from "react";

import { CircularProgress as MuiCircularProgress } from "@mui/material";

export interface ICircularProgressProps {
    color?:
        | "inherit"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning";
    disableShrink?: boolean;
    size?: string;
    thickness?: number;
    value?: number;
    variant?: "determinate" | "indeterminate";
}

const CircularProgress: FunctionComponent<ICircularProgressProps> = (
    props: ICircularProgressProps,
): ReactElement => {
    const { color, disableShrink, size, thickness, value, variant } = props;

    return (
        <MuiCircularProgress
            color={color}
            disableShrink={disableShrink}
            thickness={thickness}
            value={value}
            variant={variant}
            size={size}
        />
    );
};

CircularProgress.defaultProps = {
    color: "primary",
    disableShrink: false,
    size: "40px",
    thickness: 3.6,
    value: 0,
    variant: "indeterminate",
};

export default CircularProgress;

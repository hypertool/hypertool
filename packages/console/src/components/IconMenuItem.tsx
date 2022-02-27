import type {
    FunctionComponent,
    MouseEventHandler,
    ReactElement,
    ReactNode,
} from "react";

import { MenuItem, Typography } from "@mui/material";

import { Box, styled } from "@mui/system";

const StyledMenuItem = styled(MenuItem)({
    paddingRight: 0,
    paddingLeft: 4,
    display: "flex",
    justifyContent: "space-between",
});

const StyledTypography = styled(Typography)(({ theme }) => ({
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textAlign: "left",
}));

const FlexBox = styled(Box)({
    display: "flex",
});

export interface Props {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    // eslint-disable-next-line no-undef
    onClick?: MouseEventHandler<Element>;
    label?: string;
    MenuItemProps?: unknown;
    className?: string;
    ref?: unknown;
}

const IconMenuItem: FunctionComponent<Props> = (props: Props): ReactElement => {
    const {
        leftIcon,
        rightIcon,
        onClick,
        label,
        MenuItemProps,
        className,
        ref,
    } = props;
    return (
        <StyledMenuItem
            {...MenuItemProps}
            ref={ref as any}
            className={className}
            onClick={onClick}>
            <FlexBox>
                {leftIcon}
                <StyledTypography>{label}</StyledTypography>
            </FlexBox>
            {rightIcon}
        </StyledMenuItem>
    );
};

export default IconMenuItem;

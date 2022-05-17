import type { FunctionComponent, ReactElement } from "react";
import { useCallback } from "react";

import { ButtonBase, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { TProviderType } from "../../../../../types";

const Root = styled(ButtonBase)(({ theme }) => ({
    width: 144,
    height: 32,
    borderStyle: "solid",
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1),
}));

const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontSize: 12,
}));

interface Props {
    title: string;
    type: TProviderType;
    imageURL: string;
    selected: boolean;
    onClick: (type: TProviderType) => void;
}

const ProviderItem: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { title, type, onClick, selected } = props;
    const theme = useTheme();

    const handleClick = useCallback(() => {
        onClick(type);
    }, [onClick, type]);

    return (
        <Root
            onClick={handleClick}
            style={{
                backgroundColor: selected
                    ? theme.palette.primary.main
                    : undefined,
            }}
        >
            <Title>{title}</Title>
        </Root>
    );
};

export default ProviderItem;

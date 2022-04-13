import type { FunctionComponent, ReactElement } from "react";

import { Button, Icon, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Container = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "calc(100vh - 144px)",
});

const Image = styled("img")({
    width: "auto",
    height: 320,
});

const Message = styled(Typography)(({ theme }) => ({
    fontSize: 20,
    fontWeight: 400,
    color: theme.palette.text.secondary,
}));

const Action = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

export interface INoRecordsProps {
    message: string;
    image: string;
    actionText?: string;
    actionIcon?: string;
    onAction?: () => void;
}

const NoRecords: FunctionComponent<INoRecordsProps> = (
    props: INoRecordsProps,
): ReactElement => {
    const { message, actionText, actionIcon, onAction, image } = props;

    return (
        <Container>
            <Image src={image} alt="" />
            <Message>{message}</Message>
            {onAction && actionText && (
                <Action
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={onAction}
                    endIcon={actionIcon && <Icon>{actionIcon}</Icon>}
                >
                    {actionText}
                </Action>
            )}
        </Container>
    );
};

export default NoRecords;

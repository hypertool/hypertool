import type { FunctionComponent, ReactElement } from "react";

import { Button, Icon, Typography, styled } from "@mui/material";

const Root = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
}));

const Logo = styled("img")(({ theme }) => ({
    width: 104,
    height: "auto",
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: theme.spacing(2),
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontSize: 16,
    maxWidth: 400,
    textAlign: "center",
    marginTop: theme.spacing(1),
    lineHeight: 1.5,
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    width: 200,
}));

export interface IWelcomeProps {
    onPrimaryAction: () => void;
}

const Welcome: FunctionComponent<IWelcomeProps> = (
    props: IWelcomeProps,
): ReactElement => {
    const { onPrimaryAction } = props;
    return (
        <Root>
            <Logo src="https://res.cloudinary.com/hypertool/image/upload/v1642502111/hypertool-starter/hypertool-logo_xvqljy.png" />
            <WelcomeText>Welcome to Hypertool</WelcomeText>
            <DescriptionText>
                Looks like everything is working. Now let's get to know you, and
                start building apps!
            </DescriptionText>
            <PrimaryAction variant="contained" onClick={onPrimaryAction}>
                Let's get started
                <Icon sx={{ ml: 1 }} fontSize="small">
                    arrow_forward
                </Icon>
            </PrimaryAction>
        </Root>
    );
};

export default Welcome;

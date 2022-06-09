import { Container, styled, Typography } from "@mui/material";
import type { ReactElement, FunctionComponent } from "react";

const Root = styled(Container)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(4),
    rowGap: theme.spacing(4),
    minHeight: "calc(100vh - 64px)",
}));

const Image = styled("img")(({ theme }) => ({
    width: 400,
    height: "auto",
}));

const Message = styled(Typography)(({ theme }) => ({
    maxWidth: 600,
    lineHeight: 1.5,
    fontSize: 20,
    fontWeight: 400,
    color: theme.palette.text.secondary,
    textAlign: "center",
}));

const VerificationEmailSent: FunctionComponent = (): ReactElement => {
    return (
        <Root>
            <Image src="https://res.cloudinary.com/hypertool/image/upload/v1654801026/hypertool-assets/email-verification_iltvce.png" />
            <Message>
                Thank you for creating your Hypertool account! We have sent an
                email with a verification link to your email address.
            </Message>
        </Root>
    );
};

export default VerificationEmailSent;

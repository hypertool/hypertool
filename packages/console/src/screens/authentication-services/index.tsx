import { FunctionComponent, ReactElement } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";

import Authentication from "./Authentication";
import { AuthenticationServicesType } from "../../types";

const authServicesArray: AuthenticationServicesType[] = [
    {
        id: 1,
        name: "Google Authentication",
        description: "Google Authentication",
    },
];

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(5),
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: theme.spacing(1),
    textTransform: "none",
    width: "100%",
    [theme.breakpoints.up("md")]: {
        width: 264,
    },
}));

const Title = styled("div")(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),

    [theme.breakpoints.up("md")]: {
        fontWeight: 400,
        fontSize: 22,
    },
}));

const AuthenticationServices: FunctionComponent = (): ReactElement => {
    return (
        <Root>
            <Title>Authentication Services</Title>
            {authServicesArray.map(
                (authService: AuthenticationServicesType) => {
                    return (
                        <Authentication
                            key={authService.id}
                            authService={authService}
                        />
                    );
                },
            )}
        </Root>
    );
};

export default AuthenticationServices;

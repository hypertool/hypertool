import { FunctionComponent, ReactElement } from "react";
import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(8),
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
    textTransform: "none",
    width: "100%",
    [theme.breakpoints.up("md")]: {
        width: 264,
    },
}));

const SingleApp: FunctionComponent = (): ReactElement => {
    return (
        <Root>
            <PrimaryAction variant="contained" color="primary" size="medium">
                Authentication Services
            </PrimaryAction>
        </Root>
    );
};

export default SingleApp;

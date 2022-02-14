import { FunctionComponent, ReactElement } from "react";
import { styled } from "@mui/material/styles";

const Root = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(8),
}));

const AppBuilder: FunctionComponent = (): ReactElement => {
    return (
        <Root>
            <p style={{ color: "white" }}>AppBuilder</p>
        </Root>
    );
};

export default AppBuilder;

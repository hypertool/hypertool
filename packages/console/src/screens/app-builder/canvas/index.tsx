import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";
import { Element } from "@craftjs/core";

const Container = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "100%",
}));

interface Props {}

const Canvas: FunctionComponent<Props> = (props: Props): ReactElement => {
    return (
        <Element canvas={true}>
            <Container />
        </Element>
    );
};

export default Canvas;

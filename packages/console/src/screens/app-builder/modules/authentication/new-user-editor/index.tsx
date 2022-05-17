import { FunctionComponent, ReactElement } from "react";

import { Container as MuiContainer } from "@mui/material";
import { styled } from "@mui/material/styles";

import NewUserForm from "./NewUserForm";

const Container = styled(MuiContainer)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
}));

const NewUserEditor: FunctionComponent = (): ReactElement => {
    return (
        <Container>
            <NewUserForm />
        </Container>
    );
};

export default NewUserEditor;

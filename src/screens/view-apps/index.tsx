import type { FunctionComponent, ReactElement } from "react";

import { Container as MuiContainer } from "@mui/material";
import { styled } from "@mui/material/styles";

import AppCard from "./AppCard";

const Root = styled("section")(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
}));

const Container = styled(MuiContainer)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}));

const Apps = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

interface Props {}

const apps = [
  {
    id: "507f1f77bcf86cd799439011",
    title: "Trell ECID",
  },
  {
    id: "507f191e810c19729de860ea",
    title: "WhatsApp Notifications",
  },
  {
    id: "507f191e810c19729de860ea",
    title: "Trell Forward",
  },
];

const ViewApps: FunctionComponent<Props> = (): ReactElement => {
  return (
    <Root>
      <Container>
        <Apps>
          {apps.map((app) => (
            <AppCard id={app.id} title={app.title} />
          ))}
        </Apps>
      </Container>
    </Root>
  );
};

export default ViewApps;

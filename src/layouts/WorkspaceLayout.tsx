import type { FunctionComponent, ReactElement } from "react";

import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

import { MiniDrawer, PrimaryAppBar } from "../components";

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "row",
}));

const Main = styled("main")(({ theme }) => ({
  marginTop: theme.spacing(8),
}));

const WorkspaceLayout: FunctionComponent = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Root>
      <PrimaryAppBar open={open} onDrawerOpen={handleDrawerOpen} />
      <MiniDrawer open={open} onDrawerClose={handleDrawerClose} />
      <Main>
        <Outlet />
      </Main>
    </Root>
  );
};

export default WorkspaceLayout;

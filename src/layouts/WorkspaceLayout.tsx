import type { FunctionComponent, ReactElement } from "react";
import type { AppBarProps } from "@mui/material";

import { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

import { MiniDrawer } from "../components";

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "row",
}));

interface PrimaryAppBarProps extends AppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const PrimaryAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<PrimaryAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const ToolName = styled(Typography)(({ theme }) => ({
  fontSize: 18,
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
      <PrimaryAppBar open={open}>
        <Toolbar>
          <IconButton
            onClick={handleDrawerOpen}
            size="small"
            edge="start"
            color="inherit"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <ToolName variant="h6" sx={{ flexGrow: 1 }}>
            HyperTool
          </ToolName>
        </Toolbar>
      </PrimaryAppBar>
      <MiniDrawer open={open} onDrawerClose={handleDrawerClose} />
    </Root>
  );
};

export default WorkspaceLayout;

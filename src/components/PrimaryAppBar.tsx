import type { FunctionComponent, ReactElement } from "react";
import type { AppBarProps } from "@mui/material";

import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";

interface PrimaryAppBarProps extends AppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const MuiAppBar = styled(AppBar, {
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

interface Props {
  open: boolean;
  onDrawerOpen: () => void;
}

const PrimaryAppBar: FunctionComponent<Props> = (
  props: Props
): ReactElement => {
  const { open, onDrawerOpen } = props;
  return (
    <MuiAppBar open={open}>
      <Toolbar>
        <IconButton
          onClick={onDrawerOpen}
          size="small"
          edge="start"
          color="inherit"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <ToolName variant="h6" sx={{ flexGrow: 1 }}>
          hypertool
        </ToolName>
      </Toolbar>
    </MuiAppBar>
  );
};

export default PrimaryAppBar;

import type { FunctionComponent, ReactElement } from "react";

import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "row",
}));

const PrimaryAppBar = styled(AppBar)(({ theme }) => ({
    // backgroundColor: theme.palette.background.paper
}));

const ToolName = styled(Typography)(({ theme }) => ({
    fontSize: 18
}));

const WorkspaceLayout: FunctionComponent = (): ReactElement => {
  return (
    <Root>
      <PrimaryAppBar>
        <Toolbar>
          <IconButton size="small" edge="start" color="inherit" sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <ToolName variant="h6" sx={{ flexGrow: 1 }}>
            HyperTool
          </ToolName>
        </Toolbar>
      </PrimaryAppBar>
    </Root>
  );
};

export default WorkspaceLayout;

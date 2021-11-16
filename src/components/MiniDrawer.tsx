import type { FunctionComponent, ReactElement } from "react";

import { Fragment } from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";

import MuiDrawer from "@mui/material/Drawer";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Icon,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 56,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface Props {
  open: boolean;
  onDrawerClose: () => void;
}

const groups = [
    {
        title: "General",
        items: [
            {
                title: "Apps",
                url: "/workspace/apps",
                icon: "apps",
            },
            {
                title: "New App",
                url: "/workspace/apps/new",
                icon: "add_circle_outline",
            },
        ]
    },
    {
        title: "Administrator",
        items: [
            {
                title: "Resources",
                url: "/workspace/resources",
                icon: "source",
            },
            {
                title: "Teams",
                url: "/workspace/teams",
                icon: "people",
            },
            {
                title: "Billing",
                url: "/workspace/billing",
                icon: "sell",
            },
            {
                title: "Preferences",
                url: "/workspace/preferences",
                icon: "settings",
            },
        ]
    },
    {
        title: "Help",
        items: [
            {
                title: "Feedback",
                url: "/workspace/feedback",
                icon: "rate_review",
            },
            {
                title: "Documentation",
                url: "/documentation",
                icon: "help_outline",
            },
        ]
    },
];

const MiniDrawer: FunctionComponent<Props> = (props: Props): ReactElement => {
  const { open, onDrawerClose } = props;
  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={onDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      {groups.map((group, index: number) => (
          <Fragment key={group.title}>
              <List>
                {group.items.map((item) => (
                    <ListItem key={item.title} button={true}>
                        <ListItemIcon>
                            <Icon>{item.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItem>
                ))}
            </List>
            {index + 1 < groups.length && <Divider />}
          </Fragment>
      ))}
    </Drawer>
  );
};

export default MiniDrawer;

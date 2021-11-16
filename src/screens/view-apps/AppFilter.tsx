import type { FunctionComponent, ReactElement } from "react";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Icon,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Card = styled(MuiCard)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: "0 !important",
  paddingBottom: 2,
  minWidth: 384,
}));

const filters = [
  {
    title: "All",
    url: "/apps",
    icon: "list",
  },
  {
    title: "Recent",
    url: "/apps/recent",
    icon: "history",
  },
  {
    title: "Starred",
    url: "/apps/starred",
    icon: "star",
  },
  {
    title: "Trash",
    url: "/apps/trash",
    icon: "delete",
  },
];

const AppFilter: FunctionComponent = (): ReactElement => {
  return (
    <Card>
      <CardContent>
        <List>
          {filters.map((filter) => (
            <ListItem key={filter.title} button={true}>
              <ListItemIcon>
                <Icon fontSize="small">{filter.icon}</Icon>
              </ListItemIcon>
              <ListItemText>{filter.title}</ListItemText>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default AppFilter;

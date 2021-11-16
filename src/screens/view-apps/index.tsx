import type { FunctionComponent, ReactElement } from "react";

import { useState, useCallback } from "react";
import {
  Container as MuiContainer,
  Hidden,
  FormControl as MuiFormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import AppCard from "./AppCard";
import AppFilter from "./AppFilter";

const Root = styled("section")(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
}));

const FormControl = styled(MuiFormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const Container = styled(MuiContainer)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",

  [theme.breakpoints.up("lg")]: {
    flexDirection: "row",
  },
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

const ViewApps: FunctionComponent<Props> = (): ReactElement => {
  const [filter, setFilter] = useState<string>(filters[0].url);

  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value);
  }, []);

  const renderFilter = () => (
    <FormControl fullWidth={true}>
      <InputLabel id="filter-label">Filter</InputLabel>
      <Select
        labelId="filter-label"
        id="filter"
        value={filter}
        label="Filter"
        onChange={handleFilterChange}
      >
        {filters.map((filter) => (
          <MenuItem value={filter.url}>{filter.title}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Root>
      <Container>
        <Hidden lgDown={true}>
          <AppFilter />
        </Hidden>
        <Hidden lgUp={true}>{renderFilter()}</Hidden>
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

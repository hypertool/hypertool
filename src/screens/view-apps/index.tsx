import type { FunctionComponent, ReactElement } from "react";

import { useState, useCallback } from "react";
import {
  Container,
  Hidden,
  FormControl as MuiFormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  TextField,
  Icon,
  InputAdornment,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router";
import { gql, useQuery } from "@apollo/client";

import AppCard from "./AppCard";
import AppFilter from "./AppFilter";

const Root = styled("section")(({ theme }) => ({
  width: "100%",
}));

const Title = styled(Typography)(({ theme }) => ({}));

const WorkspaceToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}));

const ActionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
}));

const Search = styled(TextField)(({ theme }) => ({
  width: 264,
  marginRight: theme.spacing(2),
})) as any;

const ActionIcon = styled(Icon)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const FormControl = styled(MuiFormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Content = styled(Container)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  marginTop: theme.spacing(2),

  flexDirection: "column",

  [theme.breakpoints.up("lg")]: {
    flexDirection: "row",
  },
}));

const Apps = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  flexWrap: "wrap",
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

const GET_APPS = gql`
  query GetApps($page: Int, $limit: Int) {
    getApps(page: $page, limit: $limit) {
      totalPages
      records {
        id
        name
        description
        status
      }
    }
  }
`;

const ViewApps: FunctionComponent<Props> = (): ReactElement => {
  const [filter, setFilter] = useState<string>(filters[0].url);
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_APPS);

  const handleCreateNew = useCallback(() => {
    navigate("/apps/new");
  }, [navigate]);

  const handleFilterChange = useCallback((event) => {
    setFilter(event.target.value);
  }, []);

  const handleLaunch = useCallback((slug: string) => {
    const subdomain = "trell";
    window.open(`https://${subdomain}.hypertool.io/${slug}`);
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

  if (loading) {
    return <div>"Loading..."</div>;
  }

  return (
    <Root>
      <AppBar position="static" elevation={1}>
        <WorkspaceToolbar>
          <Title>Resource Library</Title>
          <ActionContainer>
            <Search
              label=""
              placeholder="Search"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon fontSize="small">search</Icon>
                  </InputAdornment>
                ),
              }}
            />
            <Button size="small" onClick={handleCreateNew}>
              <ActionIcon fontSize="small">add_circle</ActionIcon>
              Create New
            </Button>
          </ActionContainer>
        </WorkspaceToolbar>
      </AppBar>
      <Content>
        <Hidden lgDown={true}>
          <AppFilter />
        </Hidden>
        <Hidden lgUp={true}>{renderFilter()}</Hidden>
        <Apps>
          {data.getApps.records.map((app: any) => (
            <AppCard
              id={app.id}
              name={app.name}
              description={app.description}
              onLaunch={handleLaunch}
            />
          ))}
        </Apps>
      </Content>
    </Root>
  );
};

export default ViewApps;

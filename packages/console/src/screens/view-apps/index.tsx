import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Hidden,
    Icon,
    InputLabel,
    MenuItem,
    FormControl as MuiFormControl,
    Select,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { useNavigate } from "react-router";

import { NoRecords } from "../../components";

import AppCard from "./AppCard";
import AppFilter from "./AppFilter";

const Root = styled("section")(() => ({
    width: "100%",
}));

const TitleContainer = styled("div")({
    display: "flex",
    flexDirection: "row",
});

const TitleIcon = styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const Title = styled(Typography)(() => ({}));

const Text = styled(Typography)(() => ({
    color: "white",
}));

const WorkspaceToolbar = styled(Toolbar)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
}));

const ActionContainer = styled("div")(() => ({
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

const Apps = styled("div")(() => ({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
}));

const ProgressContainer = styled("div")(() => ({
    width: "100%",
    height: "calc(100vh - 256px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

const ViewApps: FunctionComponent = (): ReactElement => {
    const [filter, setFilter] = useState<string>(filters[0].url);
    const navigate = useNavigate();
    const { loading, data } = useQuery(GET_APPS);
    const records = data?.getApps?.records ?? [];

    const handleCreateNew = useCallback(() => {
        navigate("/apps/new");
    }, [navigate]);

    const handleFilterChange = useCallback((event) => {
        setFilter(event.target.value);
    }, []);

    const handleLaunch = useCallback((id: string, name: string) => {
        window.open(`https://${name}.hypertool.io/`);
    }, []);

    const handleEdit = useCallback((id: string, name: string) => {
        navigate(`/apps/${id}/builder`);
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
            <AppBar position="static" elevation={1}>
                <WorkspaceToolbar>
                    <TitleContainer>
                        <TitleIcon>apps</TitleIcon>
                        <Title>Applications</Title>
                    </TitleContainer>
                    <ActionContainer>
                        {/* <Search
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
                        /> */}
                        <Button size="small" onClick={handleCreateNew}>
                            <ActionIcon fontSize="small">add_circle</ActionIcon>
                            Create New
                        </Button>
                    </ActionContainer>
                </WorkspaceToolbar>
            </AppBar>
            <Content>
                {/* <Hidden lgDown={true}>
                    <AppFilter />
                </Hidden>
                <Hidden lgUp={true}>{renderFilter()}</Hidden>
                */}
                {loading && (
                    <ProgressContainer>
                        <CircularProgress size="28px" />
                    </ProgressContainer>
                )}

                {!loading && records.length === 0 && (
                    <NoRecords
                        message="We tried our best, but couldn't find any apps."
                        image="https://res.cloudinary.com/hypertool/image/upload/v1649820987/hypertool-assets/empty-apps_ok9nbh.svg"
                        actionText="Create New App"
                        actionIcon="add_circle_outline"
                        onAction={handleCreateNew}
                    />
                )}

                {!loading && records.length > 0 && (
                    <Apps>
                        {records.map((app: any) => (
                            <AppCard
                                key={app.id}
                                id={app.id}
                                name={app.name}
                                description={app.description}
                                onLaunch={handleLaunch}
                                onEdit={handleEdit}
                            />
                        ))}
                    </Apps>
                )}
            </Content>
        </Root>
    );
};

export default ViewApps;

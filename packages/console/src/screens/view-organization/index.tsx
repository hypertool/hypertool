import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    AppBar,
    CircularProgress,
    Container,
    Hidden as MuiHidden,
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

import AppCard from "./AppCard";

const Hidden = MuiHidden as any;

const Root = styled("section")(() => ({
    width: "100%",
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
    const { loading, data } = useQuery(GET_APPS, {
        notifyOnNetworkStatusChange: true,
    });

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

    return (
        <Root>
            <AppBar position="static" elevation={1}>
                <WorkspaceToolbar>
                    <Title>Google</Title>
                </WorkspaceToolbar>
            </AppBar>
            <Content>
                {/* <Hidden lgDown={true}>
                    <AppFilter />
                </Hidden> */}
                <Hidden lgUp={true}>{renderFilter()}</Hidden>
                {loading && (
                    <ProgressContainer>
                        <CircularProgress size="28px" />
                    </ProgressContainer>
                )}

                {!loading && data?.getApps?.records?.length === 0 && (
                    <Text>You do not have any apps yet.</Text>
                )}

                {!loading && data?.getApps?.records?.length !== 0 && (
                    <Apps>
                        {data?.getApps?.records?.map((app: any) => (
                            <AppCard
                                id={app.id}
                                name={app.name}
                                description={app.description}
                                onLaunch={handleLaunch}
                            />
                        ))}
                    </Apps>
                )}
            </Content>
        </Root>
    );
};

export default ViewApps;

import { FunctionComponent, ReactElement, useEffect } from "react";
import { useCallback } from "react";

import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Icon,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { useNavigate } from "react-router";

import AppCard from "../view-apps/AppCard";

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

const Organizations = styled("div")(() => ({
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

const GET_USER_ORGANIZATIONS = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            organizations {
                title
                name
                description
            }
        }
    }
`;

const ViewOrganizations: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    const session = localStorage.getItem("session") as string;
    const { loading, data } = useQuery(GET_USER_ORGANIZATIONS, {
        variables: {
            userId: JSON.parse(session)?.user?.id,
        },
        notifyOnNetworkStatusChange: true,
    });

    const handleCreateNew = useCallback(() => {
        navigate("/organizations/new");
    }, [navigate]);

    const handleOpen = useCallback(() => {
        navigate("/organizations/new");
    }, [navigate]);

    return (
        <Root>
            <AppBar position="static" elevation={1}>
                <WorkspaceToolbar>
                    <Title>Your Organizations</Title>
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
                {loading && (
                    <ProgressContainer>
                        <CircularProgress size="28px" />
                    </ProgressContainer>
                )}

                {!loading && data?.getUserById?.organizations?.length === 0 && (
                    <Text>You are not part of any organization.</Text>
                )}

                {!loading && data?.getUserById?.organizations?.length !== 0 && (
                    <Organizations>
                        {data?.getUserById?.organizations?.map(
                            (organization: {
                                name: string;
                                title: string;
                                description: string;
                            }) => (
                                <AppCard
                                    id={organization.name}
                                    name={organization.title}
                                    description={organization.description}
                                    onLaunch={handleOpen}
                                />
                            ),
                        )}
                    </Organizations>
                )}
            </Content>
        </Root>
    );
};

export default ViewOrganizations;

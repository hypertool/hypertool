import { FunctionComponent, ReactElement } from "react";
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

import { NoRecords } from "../../components";
import { usePrivateSession } from "../../hooks";

import OrganizationCard from "./OrganizationCard";

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

const Content = styled(Container)(({ theme }) => ({
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",

    flexDirection: "column",

    [theme.breakpoints.up("lg")]: {
        flexDirection: "row",
    },
}));

const Organizations = styled("div")(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    padding: theme.spacing(2, 0),
    gap: theme.spacing(2),
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
                id
                title
                name
                description
            }
        }
    }
`;

const ViewOrganizations: FunctionComponent = (): ReactElement => {
    const navigate = useNavigate();
    const { user } = usePrivateSession();
    const { loading, data } = useQuery(GET_USER_ORGANIZATIONS, {
        variables: {
            userId: user.id,
        },
        notifyOnNetworkStatusChange: true,
    });
    const organizations = data?.getUserById?.organizations ?? [];

    const handleCreateNew = useCallback(() => {
        navigate("/organizations/new");
    }, [navigate]);

    const handleOpen = useCallback(
        (id: string) => {
            navigate(`/organizations/${id}`);
        },
        [navigate],
    );

    return (
        <Root>
            <AppBar position="static" elevation={1}>
                <WorkspaceToolbar>
                    <TitleContainer>
                        <TitleIcon>business</TitleIcon>
                        <Title>Organizations</Title>
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
                {loading && (
                    <ProgressContainer>
                        <CircularProgress size="28px" />
                    </ProgressContainer>
                )}

                {!loading && organizations.length === 0 && (
                    <NoRecords
                        message="We tried our best, but couldn't find any organizations."
                        image="https://res.cloudinary.com/hypertool/image/upload/v1649822115/hypertool-assets/empty-organizations_qajazk.svg"
                        actionText="Create New Organization"
                        actionIcon="add_circle_outline"
                        onAction={handleCreateNew}
                    />
                )}

                {!loading && organizations.length > 0 && (
                    <Organizations>
                        {organizations.map(
                            (organization: {
                                id: string;
                                name: string;
                                title: string;
                                description: string;
                            }) => (
                                <OrganizationCard
                                    key={organization.id}
                                    id={organization.id}
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

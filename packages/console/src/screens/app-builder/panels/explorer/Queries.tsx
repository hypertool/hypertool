import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext } from "react";

import {
    Avatar,
    Button,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { BuilderActionsContext } from "../../../../contexts";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const GET_QUERY_TEMPLATES = gql`
    query GetQueryTemplates($app: ID!, $page: Int, $limit: Int) {
        getQueryTemplates(app: $app, page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
            }
        }
    }
`;

const Queries: FunctionComponent = (): ReactElement => {
    const { createTab } = useContext(BuilderActionsContext);
    const { data } = useQuery(GET_QUERY_TEMPLATES, {
        variables: {
            page: 0,
            limit: 20,
            app: "61c93a931da4a79d3a109947",
        },
    });
    const { records } = data?.getQueryTemplates || { records: [] };

    const handleNewQuery = useCallback(() => {
        createTab("new-query");
    }, [createTab]);

    const handleEditQuery = (queryId: string) => () => {
        createTab("edit-query", { queryId });
    };

    const renderQuery = (record: any) => (
        <ListItem
            key={record.id}
            secondaryAction={
                <IconButton edge="end">
                    <Icon fontSize="small">delete</Icon>
                </IconButton>
            }
            onClick={handleEditQuery(record.id)}
        >
            <ListItemAvatar>
                <Avatar sx={{ width: 28, height: 28 }}>
                    <Icon fontSize="small">category</Icon>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={record.name} />
        </ListItem>
    );

    return (
        <div>
            <List dense={true}>{records.map(renderQuery)}</List>
            <Actions>
                <Button
                    size="small"
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    endIcon={<Icon>add</Icon>}
                    onClick={handleNewQuery}
                >
                    Create New Query
                </Button>
            </Actions>
        </div>
    );
};

export default Queries;

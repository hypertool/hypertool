import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useContext } from "react";

import {
    Avatar,
    Button,
    Icon,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { useParams } from "react-router-dom";

import { BuilderActionsContext } from "../../../../contexts";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const StyledListItemAvatar = styled(ListItemAvatar)({ minWidth: 32 });

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
    const { appId } = useParams();
    const { createTab } = useContext(BuilderActionsContext);
    const { data } = useQuery(GET_QUERY_TEMPLATES, {
        variables: {
            page: 0,
            limit: 20,
            app: appId,
        },
    });
    const { records } = data?.getQueryTemplates || { records: [] };

    const handleNewQuery = useCallback(() => {
        createTab("new-query");
    }, [createTab]);

    const handleEditQuery = (queryTemplateId: string) => () => {
        createTab("edit-query", { queryTemplateId });
    };

    const renderQuery = (record: any) => (
        <ListItem
            key={record.id}
            button={true}
            /*
             * secondaryAction={
             *     <IconButton edge="end">
             *         <Icon fontSize="small">delete</Icon>
             *     </IconButton>
             * }
             */
            onClick={handleEditQuery(record.id)}
        >
            <StyledListItemAvatar>
                <Avatar sx={{ width: 20, height: 20 }}>
                    <Icon style={{ fontSize: 14 }}>workspaces</Icon>
                </Avatar>
            </StyledListItemAvatar>
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

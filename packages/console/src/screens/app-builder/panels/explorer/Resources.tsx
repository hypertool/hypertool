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

const GET_RESOURCES = gql`
    query GetResources($page: Int, $limit: Int) {
        getResources(page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
                type
                status
                createdAt
            }
        }
    }
`;

const Resources: FunctionComponent = (): ReactElement => {
    const { createTab } = useContext(BuilderActionsContext);
    const { data } = useQuery(GET_RESOURCES, {
        variables: {
            page: 0,
            limit: 20,
        },
    });
    const { records } = data?.getResources || { records: [] };

    const handleNewResource = useCallback(() => {
        createTab("new-resource");
    }, [createTab]);

    const handleEditResource = (resourceId: string) => () => {
        createTab("edit-resource", { resourceId });
    };

    const renderResource = (record: any) => (
        <ListItem
            key={record.name}
            secondaryAction={
                <IconButton edge="end">
                    <Icon fontSize="small">delete</Icon>
                </IconButton>
            }
            onClick={handleEditResource(record.id)}
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
            <List dense={true}>{records.map(renderResource)}</List>
            <Actions>
                <Button
                    size="small"
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    endIcon={<Icon>add</Icon>}
                    onClick={handleNewResource}
                >
                    Create New Resource
                </Button>
            </Actions>
        </div>
    );
};

export default Resources;

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

import { BuilderActionsContext } from "../../../../contexts";

const Actions = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(
        2,
    )} ${theme.spacing(2)}`,
}));

const StyledListItemAvatar = styled(ListItemAvatar)({ minWidth: 32 });

const GET_CONTROLLERS = gql`
    query GetControllers($page: Int, $limit: Int) {
        getControllers(page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
                language
            }
        }
    }
`;

const Controllers: FunctionComponent = (): ReactElement => {
    const { createTab } = useContext(BuilderActionsContext);
    const { data } = useQuery(GET_CONTROLLERS, {
        variables: {
            page: 0,
            limit: 20,
        },
    });
    const { records } = data?.getControllers || { records: [] };

    const handleCreateController = useCallback(() => {
        createTab("new-controller");
    }, [createTab]);

    const handleEditController = (controllerId: string) => () => {
        createTab("edit-controller", { controllerId });
    };

    const renderController = (record: any) => (
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
            onClick={handleEditController(record.id)}
        >
            <StyledListItemAvatar>
                <Avatar style={{ width: 20, height: 20 }}>
                    <Icon style={{ fontSize: 14 }}>code</Icon>
                </Avatar>
            </StyledListItemAvatar>
            <ListItemText primary={record.name} />
        </ListItem>
    );

    return (
        <div>
            <List dense={true}>{records.map(renderController)}</List>
            <Actions>
                <Button
                    size="small"
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    endIcon={<Icon>add</Icon>}
                    onClick={handleCreateController}
                >
                    Create New Controller
                </Button>
            </Actions>
        </div>
    );
};

export default Controllers;

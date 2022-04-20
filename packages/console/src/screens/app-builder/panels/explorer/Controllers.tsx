import { FunctionComponent, MouseEvent, ReactElement, useState } from "react";
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
    Menu,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useMutation, useQuery } from "@apollo/client";

import { useConfirm } from "material-ui-confirm";

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

const DELETE_CONTROLLER = gql`
    mutation DeleteController($controllerId: ID!) {
        deleteController(controllerId: $controllerId) {
            success
        }
    }
`;

const Controllers: FunctionComponent = (): ReactElement => {
    const { createTab } = useContext(BuilderActionsContext);
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const confirm = useConfirm();

    const { data } = useQuery(GET_CONTROLLERS, {
        variables: {
            page: 0,
            limit: 20,
        },
    });
    const { records } = data?.getControllers || { records: [] };

    const [deleteController] = useMutation(DELETE_CONTROLLER, {
        refetchQueries: ["GetControllers"],
    });

    const handleCreateController = useCallback(() => {
        createTab("new-controller");
    }, [createTab]);

    const handleEditController =
        (controllerId: string) => (event: MouseEvent<HTMLElement>) => {
            createTab("edit-controller", { controllerId });
            event.stopPropagation();
            setAnchor(null);
        };

    const handleOpenMenu =
        (controllerId: string) => (event: MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setAnchor(event.currentTarget);
        };

    const handleCloseMenu = useCallback(() => {
        setAnchor(null);
    }, []);

    const handleDeleteController =
        (controllerId: string) => async (event: MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setAnchor(null);

            try {
                await confirm({
                    title: "Are you sure you want to delete?",
                    description:
                        "This action cannot be undone. This will permanently delete the controller.",
                    confirmationText: "Delete",
                    cancellationText: "Cancel",
                    allowClose: true,
                });
                deleteController({
                    variables: {
                        controllerId,
                    },
                });
            } catch (error: unknown) {}
        };

    const renderController = (record: any) => (
        <ListItem
            key={record.id}
            button={true}
            secondaryAction={
                <IconButton edge="end" onClick={handleOpenMenu(record.id)}>
                    <Icon fontSize="small">more_vert</Icon>
                </IconButton>
            }
            onClick={handleEditController(record.id)}
        >
            <StyledListItemAvatar>
                <Avatar style={{ width: 20, height: 20 }}>
                    <Icon style={{ fontSize: 14 }}>code</Icon>
                </Avatar>
            </StyledListItemAvatar>
            <ListItemText primary={record.name} />
            <Menu
                anchorEl={anchor}
                keepMounted={true}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchor)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={handleEditController(record.id)}>
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteController(record.id)}>
                    Delete
                </MenuItem>
            </Menu>
        </ListItem>
    );

    return (
        <>
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
        </>
    );
};

export default Controllers;

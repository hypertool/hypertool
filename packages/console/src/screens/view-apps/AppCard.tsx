import type { FunctionComponent, MouseEvent, ReactElement } from "react";
import { useCallback, useState } from "react";

import {
    Button,
    CardContent,
    Icon,
    IconButton,
    Card as MuiCard,
    CardActions as MuiCardActions,
    Tooltip,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import AppOptionsMenu from "./AppOptionsMenu";

const Card = styled(MuiCard)(({ theme }) => ({
    width: `calc(50% - ${theme.spacing(2)})`,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const CardHeader = styled("div")(() => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
}));

const Title = styled(Typography)(() => ({
    fontSize: 16,
    fontWeight: 500,
}));

const Description = styled(Typography)(({ theme }) => ({
    fontSize: 12,
    marginTop: theme.spacing(0.5),
}));

const CardActions = styled(MuiCardActions)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
}));

const ActionIcon = styled(Icon)(() => ({
    marginLeft: 4,
    fontSize: 16,
}));

export interface IAppCardProps {
    id: string;
    name: string;
    description: string;
    onLaunch: (id: string, name: string) => void;
    onEdit: (id: string, name: string) => void;
}

const AppCard: FunctionComponent<IAppCardProps> = (
    props: IAppCardProps,
): ReactElement => {
    const { id, name, description, onLaunch, onEdit } = props;
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);

    const handleOpenOptions = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget);
    }, []);

    const handleCloseOptions = useCallback(() => {
        setAnchor(null);
    }, []);

    const handleLaunch = useCallback(() => {
        onLaunch(id, name);
    }, [id, name, onLaunch]);

    const handleEdit = useCallback(() => {
        onEdit(id, name);
    }, [id, name, onEdit]);

    return (
        <Card>
            <CardContent>
                <CardHeader>
                    <div>
                        <Title>{name}</Title>
                        <Description>{description}</Description>
                    </div>
                    <Tooltip title="More app options">
                        <IconButton
                            onClick={handleOpenOptions}
                            size="small"
                            sx={{ ml: 2 }}
                        >
                            <Icon fontSize="small">more_vert</Icon>
                        </IconButton>
                    </Tooltip>
                    <AppOptionsMenu
                        open={Boolean(anchor)}
                        onClose={handleCloseOptions}
                        anchor={anchor}
                        id={id}
                        name={name}
                        onToggleStar={() => null}
                        onDuplicate={() => null}
                        onTogglePublish={() => null}
                        onRename={() => null}
                        onLaunch={handleLaunch}
                        onDelete={() => null}
                    />
                </CardHeader>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleEdit}>
                    Edit <ActionIcon fontSize="small">edit</ActionIcon>
                </Button>
            </CardActions>
        </Card>
    );
};

export default AppCard;

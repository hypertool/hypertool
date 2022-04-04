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

import OptionsMenu from "./OrganizationOptionsMenu";

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

interface Props {
    id: string;
    name: string;
    description: string;
    onLaunch: (id: string) => void;
}

const AppCard: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { id, name, description, onLaunch } = props;
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);

    const handleOpenOptions = useCallback((event: MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget);
    }, []);

    const handleCloseOptions = useCallback(() => {
        setAnchor(null);
    }, []);

    const handleLaunch = useCallback(() => {
        onLaunch(id);
    }, [id, onLaunch]);

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
                    <OptionsMenu
                        open={Boolean(anchor)}
                        onClose={handleCloseOptions}
                        anchor={anchor}
                        id={id}
                        onToggleStar={() => null}
                        onDuplicate={() => null}
                        onTogglePublish={() => null}
                        onRename={() => null}
                        onEdit={() => null}
                        onDelete={() => null}
                    />
                </CardHeader>
            </CardContent>
            {/* <CardActions>
                <Button size="small" onClick={handleLaunch}>
                    More{" "}
                    <ActionIcon fontSize="small">arrow_forward</ActionIcon>
                </Button>
            </CardActions> */}
        </Card>
    );
};

export default AppCard;

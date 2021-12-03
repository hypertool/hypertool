import type { FunctionComponent, ReactElement, MouseEvent } from "react";

import { useState, useCallback } from "react";
import {
  Card as MuiCard,
  CardContent,
  CardActions as MuiCardActions,
  Typography,
  Button,
  Icon,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import AppOptionsMenu from "./AppOptionsMenu";

const Card = styled(MuiCard)(({ theme }) => ({
  width: `calc(50% - ${theme.spacing(2)})`,
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CardHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  marginTop: theme.spacing(0.5)
}));

const CardActions = styled(MuiCardActions)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
}));

const ActionIcon = styled(Icon)(({ theme }) => ({
  marginLeft: 4,
  fontSize: 16,
}));

interface Props {
  id: string;
  name: string;
  description: string;
}

const AppCard: FunctionComponent<Props> = (props: Props): ReactElement => {
  const { id, name, description } = props;
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleOpenOptions = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  }, []);

  const handleCloseOptions = useCallback(() => {
    setAnchor(null);
  }, []);

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <div>
            <Title>{name}</Title>
            <Description>{description}</Description>
          </div>
          <Tooltip title="More app options">
            <IconButton onClick={handleOpenOptions} size="small" sx={{ ml: 2 }}>
              <Icon fontSize="small">more_vert</Icon>
            </IconButton>
          </Tooltip>
          <AppOptionsMenu
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
      <CardActions>
        <Button size="small">
          Launch <ActionIcon fontSize="small">arrow_forward</ActionIcon>
        </Button>
      </CardActions>
    </Card>
  );
};

export default AppCard;

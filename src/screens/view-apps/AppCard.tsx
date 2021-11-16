import type { FunctionComponent, ReactElement } from "react";

import {
  Card as MuiCard,
  CardContent,
  CardActions as MuiCardActions,
  Typography,
  Button,
  Icon,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Card = styled(MuiCard)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const CardActions = styled(MuiCardActions)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
}));

const ActionIcon = styled(Icon)(({ theme }) => ({
  marginLeft: 4,
  fontSize: 16
}));

interface Props {
  id: string;
  title: string;
}

const AppCard: FunctionComponent<Props> = (props: Props): ReactElement => {
  const { title } = props;
  return (
    <Card>
      <CardContent>
        <Typography>{title}</Typography>
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

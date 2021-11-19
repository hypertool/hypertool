import type { FunctionComponent, ReactElement } from "react";

import { ButtonBase, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { ResourceType } from "../../types";

interface Props {
  title: string;
  type: ResourceType;
  imageURL: string;
  selected: boolean;
}

const Root = styled(ButtonBase)(({ theme }) => ({
    width: 144,
    height: 32,
    borderStyle: "solid",
    borderColor: theme.palette.primary.light,
    borderWidth: 1,
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1)
}));

const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
    fontSize: 12
}));

const ResourceItem: FunctionComponent<Props> = (props: Props): ReactElement => {
  const { title } = props;

  return (
    <Root>
      <Title>{title}</Title>
    </Root>
  );
};

export default ResourceItem;

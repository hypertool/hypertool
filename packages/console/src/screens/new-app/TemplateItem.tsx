import type { FunctionComponent, ReactElement } from "react";
import { useCallback } from "react";

import { ButtonBase, Icon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

const Root = styled(ButtonBase)(({ theme }) => ({
    width: 200,
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 0,
}));

const Image = styled("img")(({ theme }) => ({
    width: "100%",
    height: "auto",
    borderRadius: theme.spacing(1, 1, 0, 0),
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: 12,
}));

const Bottom = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: theme.spacing(1),
}));

const Check = styled(Icon)(({ theme }) => ({
    color: theme.palette.getContrastText(theme.palette.background.default),
}));

interface ITemplateItemProps {
    id: string;
    title: string;
    imageURL: string;
    selected: boolean;
    onClick: (id: string) => void;
}

const TemplateItem: FunctionComponent<ITemplateItemProps> = (
    props: ITemplateItemProps,
): ReactElement => {
    const { id, title, imageURL, selected, onClick } = props;
    const theme = useTheme();

    const handleClick = useCallback(() => {
        onClick(id);
    }, [onClick, id]);

    return (
        <Root
            onClick={handleClick}
            style={{
                backgroundColor: selected
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
            }}
        >
            <Image src={imageURL} />
            <Bottom>
                <Title
                    style={{
                        color: theme.palette.getContrastText(
                            theme.palette.background.default,
                        ),
                    }}
                >
                    {title}
                </Title>
                {selected && (
                    <Check fontSize="small">check_circle_outline</Check>
                )}
            </Bottom>
        </Root>
    );
};

export default TemplateItem;

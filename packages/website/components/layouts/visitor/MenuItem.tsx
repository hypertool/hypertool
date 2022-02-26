import type { FunctionComponent, ReactElement } from "react";

import { Icon } from "@mui/material";
import { styled } from "@mui/material/styles";

import { motion } from "framer-motion";
import Link from "next/link";

const Item = styled(motion.div)(({ theme }) => ({
    display: "flex",
    cursor: "pointer",
    flexDirection: "column",
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    borderWidth: 1,
    borderColor: "#fff3",
    borderStyle: "solid",
    width: 400,
    height: 120,
    [theme.breakpoints.down("sm")]: {
        margin: theme.spacing(1),
        maxWidth: 280,
    },
}));

const ItemTitle = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
}));

const ItemIcon = styled(Icon)(({ theme }) => ({
    color: "white",
    height: 32,
    width: 48,
    fontSize: 32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
}));

const Image = styled("img")(({ theme }) => ({
    height: 32,
    width: 32,
    marginRight: theme.spacing(2),
    borderRadius: theme.spacing(1),
}));

const Title = styled("div")(({ theme }) => ({
    fontWeight: 600,
    fontSize: 16,
}));

const DescriptionGrid = styled(Icon)(({ theme }) => ({
    color: "#FFFF",
    opacity: 0,
    height: 32,
    width: 48,
    fontSize: 32,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
}));

const Description = styled("div")(({ theme }) => ({
    fontSize: 12,
}));

const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
};

interface Props {
    url: string;
    title: string;
    icon?: string;
    description: string;
}

const MenuItem: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { url, title, icon, description } = props;
    return (
        <Link href={url} passHref={true}>
            <Item
                variants={variants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1 }}
            >
                <ItemTitle>
                    <ItemIcon>{icon}</ItemIcon>
                    <Title>{title}</Title>
                </ItemTitle>
                <ItemTitle>
                    <DescriptionGrid>{icon}</DescriptionGrid>
                    <Description>{description}</Description>
                </ItemTitle>
            </Item>
        </Link>
    );
};

export default MenuItem;

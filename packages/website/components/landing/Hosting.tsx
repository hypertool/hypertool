import type { FunctionComponent, ReactElement } from "react";

import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Container = styled("div")(({ theme }) => ({
    background:
        "linear-gradient(0deg, rgba(24,24,24,1) 0%, rgba(0,0,0,1) 100%)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "calc(100vh - 64px)",
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
    },
}));

const LeftContainer = styled("div")(({ theme }) => ({
    marginRight: theme.spacing(6),
    [theme.breakpoints.down("md")]: {
        marginRight: theme.spacing(0),
        padding: theme.spacing(4),
    },
}));

const RightContainer = styled("div")(({ theme }) => ({
    marginTop: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
        marginTop: theme.spacing(6),
        padding: theme.spacing(4),
    },
}));

const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    fontSize: 40,
    lineHeight: 1.3,
    color: "white",
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
        fontSize: 32,
        textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
        width: 600,
    },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
    fontSize: 16,
    marginTop: theme.spacing(3),
    textAlign: "left",
    lineHeight: 1.8,
    color: "white",
    [theme.breakpoints.down("md")]: {
        fontSize: 14,
        textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
        width: 600,
    },
}));

const Item = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: theme.spacing(3),
}));

const ItemImage = styled("img")(({ theme }) => ({
    width: 56,
    height: "auto",
}));

const ItemContent = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
}));

const ItemTitle = styled(Typography)(({ theme }) => ({
    fontSize: 20,
    lineHeight: 1.3,
    fontWeight: 600,
    color: "white",
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
        fontSize: 18,
        textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
        width: 600,
    },
}));

const ItemSubTitle = styled(Typography)(({ theme }) => ({
    fontSize: 15,
    marginTop: theme.spacing(1),
    textAlign: "left",
    lineHeight: 1.8,
    color: "white",
    maxWidth: 360,
    [theme.breakpoints.down("md")]: {
        fontSize: 14,
        textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
        width: 600,
    },
}));

const Hosting: FunctionComponent = (): ReactElement => {
    const options = [
        {
            title: "Hypertool X",
            description:
                "Let Hypertool manage everything for you off-premise or on-premise, including premium features.",
            imageURL:
                "https://res.cloudinary.com/hypertool/image/upload/v1654536578/hypertool-assets/hypertool-logo_mntoj8.png",
        },
        {
            title: "Docker",
            description:
                "Deploy Hypertool on your own infrastructure using Docker and Docker Compose.",
            imageURL:
                "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png.webp",
        },
        {
            title: "Kubernetes",
            description:
                "Deploy Hypertool on your own infrastructure using Docker and Kubernetes.",
            imageURL: "https://kubernetes.io/images/wheel.svg",
        },
    ];

    return (
        <Container>
            <LeftContainer>
                <Title>Securely deploy on your terms</Title>
                <SubTitle>
                    With our open source platform, data never has to leave your
                    infrastructure when Hypertool is deployed on Kubernetes or
                    Docker. Alternatively, choose Hypertool X and let Hypertool
                    manage everything for you.
                </SubTitle>
            </LeftContainer>
            <RightContainer>
                {options.map((option) => (
                    <Item key={option.title}>
                        <Item>
                            <ItemImage src={option.imageURL} />
                            <ItemContent>
                                <ItemTitle>{option.title}</ItemTitle>
                                <ItemSubTitle>
                                    {option.description}
                                </ItemSubTitle>
                            </ItemContent>
                        </Item>
                    </Item>
                ))}
            </RightContainer>
        </Container>
    );
};

export default Hosting;

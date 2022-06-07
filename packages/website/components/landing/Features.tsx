import type { FunctionComponent, ReactElement } from "react";

import { Hidden as MuiHidden, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Terminal } from "../common";

const Hidden = MuiHidden as any;

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
    [theme.breakpoints.down("md")]: {
        marginTop: theme.spacing(6),
        padding: theme.spacing(4),
    },
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: 40,
    fontWeight: 800,
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
    fontSize: 20,
    marginTop: theme.spacing(3),
    textAlign: "left",
    lineHeight: 1.8,
    color: "white",
    [theme.breakpoints.down("md")]: {
        fontSize: 16,
        textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
        width: 600,
    },
}));

const Line = styled("span")(({ theme }) => ({
    lineHeight: 1.5,
}));

const Image = styled("img")({
    width: 600,
    height: "auto",
});

const Features: FunctionComponent = (): ReactElement => {
    const renderPrompt = () => (
        <>
            <span style={{ color: "green" }}>hypertool@work</span>:
            <span style={{ color: "blue" }}>~</span>${" "}
        </>
    );

    const renderOpenSource = () => (
        <Terminal>
            <Line>
                {renderPrompt()}
                git clone https://github.com/hypertool/hypertool
            </Line>
        </Terminal>
    );

    const renderStart = () => (
        <Image src="https://res.cloudinary.com/hypertool/image/upload/v1649820987/hypertool-assets/empty-apps_ok9nbh.svg" />
    );

    const sections = [
        {
            title: "Build applications with powerful features",
            text: "Hypertool gives you everything you need out of the box: component library, routing, authentication, authorization, team management, audit logging, automated deployment pipelines, and a lot more!",
            terminal: renderStart,
        },
        {
            title: "Avoid vendor lock-in with Hypertool",
            text: "Our client-side technologies are open source and hosted on GitHub. In the long run, if Hypertool does not meet your requirements, you can always eject your project from Hypertool without throwing away everything.",
            terminal: renderOpenSource,
        },
    ];

    return (
        <>
            {sections.map((section, index) =>
                index % 2 === 0 ? (
                    <Container key={section.title}>
                        <LeftContainer>
                            <Title>{section.title}</Title>
                            <SubTitle>{section.text}</SubTitle>
                        </LeftContainer>
                        <Hidden lgDown={true}>
                            <RightContainer>
                                {section.terminal()}
                            </RightContainer>
                        </Hidden>
                    </Container>
                ) : (
                    <Container key={section.title}>
                        <Hidden lgDown={true}>
                            <LeftContainer>{section.terminal()}</LeftContainer>
                        </Hidden>
                        <RightContainer>
                            <Title>{section.title}</Title>
                            <SubTitle>{section.text}</SubTitle>
                        </RightContainer>
                    </Container>
                ),
            )}
        </>
    );
};

export default Features;

import type { FunctionComponent, ReactElement } from "react";

import { Hidden, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Terminal } from "../common";

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

const GreenText = styled("span")(({ theme }) => ({
    color: "green",
}));

const GreyText = styled("span")(({ theme }) => ({
    color: "green",
}));

const Features: FunctionComponent = (): ReactElement => {
    const renderPrompt = () => (
        <>
            <span style={{ color: "green" }}>hypertool@work</span>:
            <span style={{ color: "blue" }}>~</span>${" "}
        </>
    );

    const renderInstall = () => (
        <Terminal>
            <Line>
                {renderPrompt()}
                <span>npm install --global @hypertool/cli</span>
            </Line>
            <br />
            <Line>
                <span
                    style={{
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    Installed 1 new package
                </span>{" "}
                <span
                    style={{
                        color: "green",
                        fontWeight: "bold",
                    }}
                >
                    (42ms)
                </span>
            </Line>
        </Terminal>
    );

    const renderSafeAndSecure = () => (
        <Terminal>
            <Line>
                {renderPrompt()}
                <span>hypertool auth</span>
            </Line>
            <br />
            <Line>
                <span
                    style={{
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    Hello, John.
                </span>
            </Line>
            <br />
            <Line>
                <span
                    style={{
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    You are authenticated with johndoe@gmail.com.
                </span>
            </Line>
        </Terminal>
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
        <Terminal>
            <Line>
                {renderPrompt()}
                <span>hypertool start</span>
            </Line>
            <br />
            <Line>
                <span
                    style={{
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    hypertool v0.2.2
                </span>{" "}
                <span
                    style={{
                        color: "green",
                        fontWeight: "bold",
                    }}
                >
                    (https://hypertool.io)
                </span>
            </Line>
        </Terminal>
    );

    const sections = [
        {
            title: "Build applications with powerful features",
            text: "Hypertool gives you everything you need out of the box: component library, routing, authentication, authorization, team management, audit logging, automated deployment pipelines, and a lot more!",
            terminal: renderStart,
        },
        {
            title: "Manage your apps from the terminal",
            text: "Hypertool CLI is light-weight and does not have high system requirements. All you need is NodeJS installed on your machine. Hypertool can be installed using NPM or Yarn, and takes just a few seconds to be up and running.",
            terminal: renderInstall,
        },
        {
            title: "Built for developers with GitOps in mind",
            text: "App definitions, configurations, and environments are declarative and version controlled. Deployments and lifecycle management of your apps are automated, auditable, and easy to understand.",
            terminal: renderSafeAndSecure,
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

import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { Terminal } from "../common";

const Container = styled("div")(({ theme }) => ({
    background: 'linear-gradient(0deg, rgba(24,24,24,1) 0%, rgba(0,0,0,1) 100%)',
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
        padding: theme.spacing(4)
    },
}))

const RightContainer = styled("div")(({ theme }) => ({
    marginTop: theme.spacing(0),
    [theme.breakpoints.down("md")]: {
        marginTop: theme.spacing(6),
        padding: theme.spacing(4)
    },
}))

const Title = styled(Typography)(({ theme }) => ({
    fontSize: 40,
    lineHeight: 1.3,
    color: "white",
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
        fontSize: 32,
        textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
        width: 600
    }
}));

const SubTitle = styled(Typography)(({ theme }) => ({
    fontSize: 20,
    marginTop: theme.spacing(3),
    textAlign: "left",
    lineHeight: 1.4,
    color: "white",
    [theme.breakpoints.down("md")]: {
        fontSize: 16,
        textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
        width: 600
    }
}));

const Line = styled('span')(({ theme }) => ({
    lineHeight: 1.5,
}))

const GreenText = styled('span')(({ theme }) => ({
    color: 'green',
}))

const GreyText = styled('span')(({ theme }) => ({
    color: 'green',
}))

const Features = () => {
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
                <span>npm install -global @hypertool/core</span>
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
                <span>git clone</span>{" "}
                <span style={{ color: "yellow" }}>
                    https://github.com/hypertool/hypertool
                </span>
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
                    hypertool 0.1.15
                </span>{" "}
                <span
                    style={{
                        color: "green",
                        fontWeight: "bold",
                    }}
                >
                    (https://hypertool.io/docs)
                </span>
            </Line>
        </Terminal>
    );

    const sections = [
        {
            title: "Start building fast",
            text: "Hypertool gives you everything you need out of the box, such as a component library, routing, authentication and access control, team management and a lot more!",
            terminal: renderStart,
        },
        {
            title: "Installs in seconds",
            text: "Hypertool CLI does not have high system requirements. All you need to have is NodeJS installed on your machine. Rover can be installed using npm or yarn, and takes just a few seconds to be up and running.",
            terminal: renderInstall,
        },
        {
            title: "Safe and Secure",
            text: "Hypertool CLI lets you access all your existing Hypertool apps, including your resources and queries, and allows creation of new apps only after your machine is authenticated from your terminal.",
            terminal: renderSafeAndSecure,
        },
        {
            title: "Free and Open-Source",
            text: "Hypertool is free and open source. All our code is hosted on GitHub. Hypertool is light-weight, has a very small bundle size and hardly takes any space on your machine.",
            terminal: renderOpenSource,
        },
    ];


    return sections.map((section, index) =>
        index % 2 === 0 ? (
            <Container key={section.title}>
                <LeftContainer>
                    <Title>
                        {section.title}
                    </Title>
                    <SubTitle>
                        {section.text}
                    </SubTitle>
                </LeftContainer>
                <RightContainer>
                    {section.terminal()}
                </RightContainer>
            </Container>
        ) : (
            <Container key={section.title}>
                <LeftContainer>
                {section.terminal()}
                </LeftContainer>
                <RightContainer>
                    <Title>
                        {section.title}
                    </Title>
                    <SubTitle>
                        {section.text}
                    </SubTitle>
                </RightContainer>
            </Container>
        ));
};

export default Features;
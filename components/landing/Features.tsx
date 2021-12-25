import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";
import { Terminal } from "../common";

const Container = styled("div")(({ theme }) => ({
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
    fontSize: 24,
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
            <span style={{ color: "green" }}>rover@Titan</span>:
            <span style={{ color: "blue" }}>~</span>${" "}
        </>
    );

    const renderInstall = () => (
        <Terminal>
            <Line>
                {renderPrompt()}
                <span>npm install -global @academyjs/rover</span>
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

    const renderExercises = () => (
        <Terminal>
            <Line>
                {renderPrompt()}
                <span>rover show node/factorial</span>
            </Line>
            <br />
            <Line>
                <span
                    style={{
                        color: "yellow",
                        fontWeight: "bold",
                    }}
                >
                    node/factorial
                </span>
                <br />
                <br />
                <span>Calculate the factorial of a given integer.</span>
                <br />
                <br />
                <span>
                    Factorial of a non-negative integer, is multiplication of
                    all integers smaller than or equal to n. For example
                    factorial of 6 is 6 * 5 * 4 * 3 * 2 * 1 which is 720.
                </span>
                <br />
                <br />
                <span>
                    Factorial can be calculated iteratively or recursively. You
                    can solve using any approach.
                </span>
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <GreenText>✔ </GreenText>
                <span>Write the program in factorial.js</span>
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <GreenText>✔ </GreenText>
                <span>Calculate the factorial of 5</span>
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <GreenText>✔ </GreenText>
                <span>Calculate the factorial of 6</span>
            </Line>
        </Terminal>
    );

    const renderOpenSource = () => (
        <Terminal>
            <Line>
                {renderPrompt()}
                <span>git clone</span>{" "}
                <span style={{ color: "yellow" }}>
                    https://github.com/itsganymede/rover
                </span>
            </Line>
        </Terminal>
    );

    const renderPathway = () => (
        <Terminal>
            <Line>
                {renderPrompt()}
                <span>rover submit node/factorial</span>
            </Line>
            <br />
            <Line>
                <span
                    style={{
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    rover 0.1.15
                </span>{" "}
                <span
                    style={{
                        color: "green",
                        fontWeight: "bold",
                    }}
                >
                    (https://academyjs.com/rover)
                </span>
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;&nbsp;&nbsp;‣ node/factorial
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↪ Calculate the factorial of
                a given integer.
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <GreenText>✔ </GreenText>
                <GreyText>
                    Write the program in factorial.js
                </GreyText>
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <GreenText>✔ </GreenText>
                <GreyText>
                    Calculate the factorial of 5
                </GreyText>
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <GreenText>✔ </GreenText>
                <GreyText>
                    Calculate the factorial of 6
                </GreyText>
            </Line>
            <br />
            <br />
            <Line>
                &nbsp;&nbsp;
                <GreenText>3 passing</GreenText>
                <GreyText>(33ms)</GreyText>
            </Line>
        </Terminal>
    );

    const sections = [
        {
            title: "Installs in seconds",
            text: "Rover does not have high system requirements. All you need to have is NodeJS installed on your machine. Rover can be installed using npm or yarn, and takes just a few seconds to be up and running.",
            terminal: renderInstall,
        },
        {
            title: "Built-in exercises",
            text: "Each exercises that you want to work on comes with a unique handle, that you need to use when you are submitting your solution to Rover. All the exercises are built-in.",
            terminal: renderExercises,
        },
        {
            title: "Free and Open-Source",
            text: "Rover is free and open source. All our code is hosted on GitHub. Rover is light-weight, has a very small bundle size and hardly takes any space on your machine.",
            terminal: renderOpenSource,
        },
        {
            title: "Structured pathway",
            text: "The exercises in Rover go hand-in-hand with the courses taught at AcademyJS. Enroll and follow a structured pathway towards your dream job.",
            terminal: renderPathway,
        },
    ];


    return sections.map(section =>
        <Container key={section.title}>
            <div>
                <Title>
                    {section.title}
                </Title>
                <SubTitle>
                    {section.text}
                </SubTitle>
            </div>
            {section.terminal()}
        </Container>);

};

export default Features;
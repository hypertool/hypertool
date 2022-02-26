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
    marginBottom: theme.spacing(4),
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
    [theme.breakpoints.down("md")]: {
        fontSize: 14,
        textAlign: "center",
    },
    [theme.breakpoints.up("md")]: {
        width: 600,
    },
}));

const Problems: FunctionComponent = (): ReactElement => {
    return (
        <Container>
            <LeftContainer>
                <Title>The problems with building internal tools</Title>
                <SubTitle>
                    As developers ourselves, we have closely worked with many
                    different teams to build internal tools. Non-tech teams use
                    spreadsheets to track data, use third-party tools to analyze
                    data, and need internal tools for business-specific
                    operations.
                </SubTitle>
            </LeftContainer>
            <RightContainer>
                <Item>
                    <ItemTitle>Cannot move fast</ItemTitle>
                    <ItemSubTitle>
                        If your company teaches science to students, spending
                        majority of your time building internal tools does not
                        make sense. Instead you should focus on providing your
                        core services.
                    </ItemSubTitle>
                </Item>
                <Item>
                    <ItemTitle>Repetitive tasks</ItemTitle>
                    <ItemSubTitle>
                        Even if the internal tool is used by a small team,
                        authentication, authorization, audit logging, and other
                        such mundane features are important. Implementing all of
                        this requires a lot of human resources and caffeine! At
                        a point, building internal tools becomes repetitive and
                        boring.
                    </ItemSubTitle>
                </Item>
                <Item>
                    <ItemTitle>Maintenance is a hassle</ItemTitle>
                    <ItemSubTitle>
                        Developers are usually excited to build new projects.
                        When they are working on a fresh codebase they can build
                        and iterate quickly. The problem is when the tool is
                        unused for a few months but is needed now, and the
                        original developer has moved on to another project, so
                        there is no one to update and fix the tool.
                    </ItemSubTitle>
                </Item>
            </RightContainer>
        </Container>
    );
};

export default Problems;

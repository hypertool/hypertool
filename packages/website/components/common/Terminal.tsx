import React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";


const ApplicationFormPaper = styled('div')(({ theme }) => ({
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.225)",
    borderRadius: 8,
    width: 600,
    [theme.breakpoints.down("md")]: {
        width: 400
    },
}))

const Taskbar = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    display: "flex",
    flexDirection: "row",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
}))

const Buttons = styled('div')(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
}))

const Text = styled(Typography)(({ theme }) => ({
    fontSize: 16,
    fontFamily: "'Space Mono', monospace",
    lineHeight: 1.2,
    color: "white",
    textAlign: "left",
    width: "100%",
}))

const BottomBar = styled('div')(({ theme }) => ({
    backgroundColor: "rgba(17, 25, 40, 0.30)",
    borderWidth: 0,
    borderTopWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.225)",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    minHeight: 100,
}))

const RedButton = styled('div')(({ theme }) => ({
    width: 16,
    height: 16,
    borderRadius: 16,
    marginLeft: theme.spacing(1),
    backgroundColor: "#ff605c",
}))

const YellowButton = styled('div')(({ theme }) => ({
    width: 16,
    height: 16,
    borderRadius: 16,
    marginLeft: theme.spacing(1),
    backgroundColor: "#ffbd44",
}));

const GreenButton = styled('div')(({ theme }) => ({
    width: 16,
    height: 16,
    borderRadius: 16,
    marginLeft: theme.spacing(1),
    backgroundColor: "#00ca4e",
}))

const Terminal = (props: any) => {
    return (
        <ApplicationFormPaper>
            <Taskbar>
                <Buttons>
                    <RedButton />
                    <YellowButton />
                    <GreenButton />
                </Buttons>
            </Taskbar>
            <BottomBar>
                <Text>
                    {props.children}
                </Text>
            </BottomBar>
        </ApplicationFormPaper>
    );
};

export default Terminal;
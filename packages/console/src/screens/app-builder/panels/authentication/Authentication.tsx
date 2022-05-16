import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import AuthenticationNavigation from "./AuthenticationNavigation";

const DrawerHeader = styled("section")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
    padding: theme.spacing(0, 2),
}));

const DrawerTitle = styled("b")({
    fontSize: 14,
});

const Authentication: FunctionComponent = (): ReactElement => {
    return (
        <>
            <DrawerHeader>
                <DrawerTitle>Authentication</DrawerTitle>
            </DrawerHeader>
            <AuthenticationNavigation />
        </>
    );
};

export default Authentication;

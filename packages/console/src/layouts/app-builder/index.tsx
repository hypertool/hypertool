import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import { styled } from "@mui/material/styles";

import { Editor } from "@craftjs/core";
import { Outlet } from "react-router-dom";

import { nodeMappings } from "../../nodes";

import { RenderNode } from "./RenderNode";
import { AppBar, LeftDrawer, RightDrawer } from "./navigation";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "row",
}));

const Main = styled("main")(({ theme }) => ({
    backgroundColor: (theme.palette.background as any).main,
    marginTop: theme.spacing(8),
    width: "100%",
}));

const AppBuilderLayout: FunctionComponent = (): ReactElement => {
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(true);

    const handleLeftDrawerOpen = () => {
        setLeftDrawerOpen(true);
    };

    const handleLeftDrawerClose = () => {
        setLeftDrawerOpen(false);
    };

    const handleRightDrawerClose = useCallback(() => {
        setRightDrawerOpen(false);
    }, []);

    return (
        <Editor resolver={nodeMappings} onRender={RenderNode}>
            <Root>
                <AppBar open={leftDrawerOpen} />
                <LeftDrawer
                    open={leftDrawerOpen}
                    onDrawerOpen={handleLeftDrawerOpen}
                    onDrawerClose={handleLeftDrawerClose}
                />
                <Main>
                    <Outlet />
                </Main>
                <RightDrawer
                    open={rightDrawerOpen}
                    onDrawerClose={handleRightDrawerClose}
                />
            </Root>
        </Editor>
    );
};

export default AppBuilderLayout;

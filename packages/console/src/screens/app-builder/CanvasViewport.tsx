import { FunctionComponent } from "react";

import { styled } from "@mui/material/styles";

import { useEditor } from "@craftjs/core";

import CanvasHeader from "./CanvasHeader";

const PageContainer = styled("div")(({ theme }) => ({
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(3),
    overflow: "hidden",
}));

const CraftRenderer = styled("div")(({ theme }) => ({
    display: "flex",
    overflow: "auto",
    height: "100%",
    width: "100%",
    backgroundColor: (theme.palette.background as any).paper1,
}));

const CanvasContainer = styled("div")(({ theme }) => ({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(1),
}));

const PageFooter = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: 8,
}));

interface ViewportProps {
    children: any;
}

const CanvasViewport: FunctionComponent<ViewportProps> = (
    props: ViewportProps,
) => {
    const { connectors } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));

    return (
        <PageContainer className="page-container">
            <CanvasHeader />
            <CraftRenderer
                className="craft-renderer"
                ref={(ref) =>
                    connectors.select(
                        connectors.hover(ref as any, null as any),
                        null as any,
                    )
                }
            >
                <CanvasContainer>{props.children}</CanvasContainer>
                <PageFooter>Powered by Hypertool</PageFooter>
            </CraftRenderer>
        </PageContainer>
    );
};

export default CanvasViewport;

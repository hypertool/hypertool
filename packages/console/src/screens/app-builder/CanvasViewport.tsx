import { FunctionComponent } from "react";

import { styled } from "@mui/material/styles";

import { useEditor } from "../../craft";

const PageContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
}));

const CraftRenderer = styled("div")(({ theme }) => ({
    display: "flex",
    overflow: "auto",
    width: "100%",
    minHeight: 800,
    backgroundColor: (theme.palette.background as any).paper1,
}));

const CanvasContainer = styled("div")(() => ({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
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
        <>
            <PageContainer className="page-container">
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
                </CraftRenderer>
            </PageContainer>
        </>
    );
};

export default CanvasViewport;

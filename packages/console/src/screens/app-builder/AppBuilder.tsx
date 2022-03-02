import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { styled } from "@mui/material/styles";

import * as uuid from "uuid";
import { Editor } from "@craftjs/core";

import { ArtifactsContext, BuilderActionsContext } from "../../contexts";
import { useInflateArtifacts, useQueryParams } from "../../hooks";
import { nodeMappings } from "../../nodes";
import type { ITab, TTabType } from "../../types";
import { constants, templates } from "../../utils";

import CanvasEditor from "./CanvasEditor";
import CodeEditor from "./CodeEditor";
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
    marginTop: theme.spacing(6),
    width: "100%",
}));

const Content = styled("section")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(0),
}));

type Modes = "design" | "code";

const iconByType: { [key: string]: string } = {
    controller: "code",
    query: "category",
};

const AppBuilder: FunctionComponent = (): ReactElement => {
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
    const [mode, setMode] = useState<Modes>("design");
    const params = useQueryParams();
    const [editorValue, setEditorValue] = useState<string | undefined>(
        templates.CONTROLLER_TEMPLATE,
    );
    const [tabs, setTabs] = useState<ITab[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const setCounts = useState<Record<string, number>>(() =>
        Object.fromEntries(
            constants.tabTypes.map((tabType: string) => [tabType, 0]),
        ),
    )[1];

    const { type: activeTabType } = useMemo(
        () =>
            tabs.find((tab) => tab.id === activeTab) || {
                type: undefined,
            },
        [activeTab, tabs],
    );

    /*
     * TODO: For some reason, `useMemo` causes binding issues in callbacks
     * resulting in incomprehensible behavior.
     */
    const builderActions = {
        tabs,
        activeTab,
        setActiveTab,
        createNewTab: (title: string, type: TTabType) => {
            setCounts((oldCount) => {
                const newCount = oldCount[type] + 1;

                setTabs((tabs) => {
                    const newTabId = uuid.v4();
                    const newTab = {
                        id: newTabId,
                        title: `${title} ${newCount}`,
                        icon: iconByType[type],
                        type,
                    };

                    setActiveTab(newTabId);

                    return [...tabs, newTab];
                });

                return { ...oldCount, [type]: newCount };
            });
        },
    };

    useEffect(() => {
        if ((params as any).mode && (params as any).mode !== mode) {
            setMode((params as any).mode);
        }
    }, [params, mode]);

    useEffect(() => {
        document.title = "App Builder | Hypertool";
    }, []);

    const artifacts = useInflateArtifacts([
        { id: "anonymous", code: editorValue ?? "" },
    ]);

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
            <BuilderActionsContext.Provider value={builderActions}>
                <ArtifactsContext.Provider value={artifacts}>
                    <Root>
                        <AppBar open={leftDrawerOpen} />
                        <LeftDrawer
                            open={leftDrawerOpen}
                            onDrawerOpen={handleLeftDrawerOpen}
                            onDrawerClose={handleLeftDrawerClose}
                        />
                        <Main>
                            <Content>
                                {activeTabType === "controller" && (
                                    <CodeEditor
                                        value={editorValue}
                                        onChange={setEditorValue}
                                    />
                                )}
                                {activeTabType === "page" && <CanvasEditor />}
                            </Content>
                        </Main>
                        <RightDrawer
                            open={rightDrawerOpen}
                            onDrawerClose={handleRightDrawerClose}
                        />
                    </Root>
                </ArtifactsContext.Provider>
            </BuilderActionsContext.Provider>
        </Editor>
    );
};

export default AppBuilder;

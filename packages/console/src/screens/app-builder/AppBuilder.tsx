import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { styled } from "@mui/material/styles";

import * as uuid from "uuid";
import { Editor } from "@craftjs/core";
import { useMonaco } from "@monaco-editor/react";

import { ArtifactsContext, BuilderActionsContext } from "../../contexts";
import { useInflateArtifacts } from "../../hooks";
import { nodeMappings } from "../../nodes";
import type { IDeflatedArtifact, ITab, TTabType } from "../../types";
import { constants, templates } from "../../utils";
import ResourceEditor from "../edit-resource";
import NewControllerEditor from "../new-controller";
import NewQueryEditor from "../new-query";
import NewResourceEditor from "../new-resource";
import NewScreenEditor from "../new-screen";

import CanvasEditor from "./CanvasEditor";
import CodeEditor from "./CodeEditor";
import { RenderNode } from "./RenderNode";
import { AppBar, LeftDrawer, RightDrawer } from "./navigation";

/* TODO: Move these constructs to @hypertool/common. */
export type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T;

const truthy = <T,>(value: T): value is Truthy<T> => {
    return !!value;
};

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

const iconByType: { [key: string]: string } = {
    controller: "code",
    query: "category",
};

const AppBuilder: FunctionComponent = (): ReactElement => {
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(true);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(true);
    const [tabs, setTabs] = useState<ITab[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const setCounts = useState<Record<string, number>>(() =>
        Object.fromEntries(
            constants.tabTypes.map((tabType: string) => [tabType, 0]),
        ),
    )[1];
    const [deflatedArtifacts, setDeflatedArtifacts] = useState<
        IDeflatedArtifact[]
    >([]);
    const artifacts = useInflateArtifacts(deflatedArtifacts);
    const monaco = useMonaco();

    const { type: activeTabType } = useMemo(
        () =>
            tabs.find((tab) => tab.id === activeTab) || {
                type: undefined,
                bundle: undefined,
            },
        [activeTab, tabs],
    );

    /*
     * The `deflateArtifacts` function loads the latest code from the Monaco editor
     * models for all the controller tabs.
     */
    const deflateArtifacts = useCallback(
        (tabs: ITab[]) => {
            const newDeflatedArtifacts = tabs
                .map((tab): IDeflatedArtifact | null => {
                    if (tab.type === "controller") {
                        const uri = monaco?.Uri.parse(tab.id);
                        const model = monaco?.editor.getModel(uri as any);
                        const code = model?.getValue() || "";
                        return { id: tab.id, code, path: tab.bundle.path };
                    }
                    return null;
                })
                .filter(truthy);
            setDeflatedArtifacts(newDeflatedArtifacts);
        },
        [monaco?.Uri, monaco?.editor],
    );

    const handleMonacoChange = useCallback(() => {
        deflateArtifacts(tabs);
    }, [deflateArtifacts, tabs]);

    /*
     * TODO: For some reason, `useMemo` causes binding issues in callbacks
     * resulting in incomprehensible behavior.
     */
    const builderActions = {
        tabs,
        activeTab,
        setActiveTab,
        createNewTab: (
            title: string,
            placeholderTitle: boolean,
            type: TTabType,
        ) => {
            setCounts((oldCount) => {
                const newCount = oldCount[type] + 1;

                setTabs((tabs) => {
                    const newTabId = uuid.v4();
                    const newTab = {
                        id: newTabId,
                        title: placeholderTitle
                            ? `${title} ${newCount}`
                            : title,
                        icon: iconByType[type],
                        type,
                        bundle: {
                            ...(type === "controller" ? { path: title } : {}),
                        },
                    };

                    setActiveTab(newTabId);

                    /*
                     * When a new controller tab is created, load the default
                     * template controller.
                     */
                    if (type === "controller") {
                        setDeflatedArtifacts((oldDeflatedArtifacts) => [
                            ...oldDeflatedArtifacts,
                            {
                                id: newTabId,
                                code: templates.CONTROLLER_TEMPLATE,
                                /* The title for new controller tabs carries the path
                                 * of the controller.
                                 */
                                path: title,
                            },
                        ]);
                    }

                    return [...tabs, newTab];
                });

                return { ...oldCount, [type]: newCount };
            });
        },
    };

    useEffect(() => {
        document.title = "App Builder | Hypertool";
    }, []);

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
                                {activeTabType === "new-controller" && (
                                    <NewControllerEditor />
                                )}
                                {activeTabType === "edit-controller" && (
                                    <CodeEditor
                                        onChange={handleMonacoChange as any}
                                        path={activeTab as string}
                                    />
                                )}
                                {activeTabType === "new-screen" && (
                                    <NewScreenEditor />
                                )}
                                {activeTabType === "edit-screen" && (
                                    <CanvasEditor />
                                )}
                                {activeTabType === "new-resource" && (
                                    <NewResourceEditor />
                                )}
                                {activeTabType === "edit-resource" && (
                                    <ResourceEditor />
                                )}
                                {activeTabType === "new-query" && (
                                    <NewQueryEditor />
                                )}
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

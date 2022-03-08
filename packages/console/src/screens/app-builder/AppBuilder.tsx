import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { styled } from "@mui/material/styles";

import * as uuid from "uuid";
import { Editor } from "@craftjs/core";
import { useMonaco } from "@monaco-editor/react";

import {
    ArtifactsContext,
    BuilderActionsContext,
    TabContext,
} from "../../contexts";
import { useInflateArtifacts } from "../../hooks";
import { nodeMappings } from "../../nodes";
import type {
    IBuilderActionsContext,
    IDeflatedArtifact,
    IEditControllerBundle,
    IEditQueryBundle,
    IEditResourceBundle,
    ITab,
    TBundleType,
    TTabType,
} from "../../types";
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

interface TabTypeDetails {
    icon: string;
    title: string;
}

const tabDetailsByType: Record<string, TabTypeDetails> = {
    "new-query": {
        icon: "workspaces",
        title: "New Query",
    },
    "edit-query": {
        icon: "workspaces",
        title: "Edit Query",
    },
    "new-controller": {
        icon: "code",
        title: "New Controller",
    },
    "edit-controller": {
        icon: "code",
        title: "Edit Controller",
    },
    "new-screen": {
        icon: "wysiwyg",
        title: "New Screen",
    },
    "edit-screen": {
        icon: "wysiwyg",
        title: "Edit Screen",
    },
    "new-resource": {
        icon: "category",
        title: "New Resource",
    },
    "edit-resource": {
        icon: "category",
        title: "Edit Resource",
    },
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
                        return {
                            id: tab.id,
                            code,
                            path: activeTab || "<invalid>",
                        };
                    }
                    return null;
                })
                .filter(truthy);
            setDeflatedArtifacts(newDeflatedArtifacts);
        },
        [activeTab, monaco?.Uri, monaco?.editor],
    );

    const handleMonacoChange = useCallback(() => {
        deflateArtifacts(tabs);
    }, [deflateArtifacts, tabs]);

    /*
     * TODO: For some reason, `useMemo` causes binding issues in callbacks
     * resulting in incomprehensible behavior.
     */
    const builderActions: IBuilderActionsContext = {
        tabs,
        activeTab,
        setActiveTab,
        insertTab: (
            index: number,
            replace: boolean,
            type: TTabType,
            bundle?: TBundleType,
        ): void => {
            const tabDetails = tabDetailsByType[type];
            if (!tabDetails) {
                throw new Error(`Unknown tab type "${type}".`);
            }

            setCounts((oldCount) => {
                const newCount = oldCount[type] + 1;

                setTabs((oldTabs) => {
                    /*
                     * Edit tabs will be reactivated if they were previously
                     * created.
                     */
                    const oldTab = oldTabs.find((oldTab) => {
                        const { type: oldType, bundle: oldBundle } = oldTab;
                        if (type !== oldType) {
                            return false;
                        }

                        switch (type) {
                            case "edit-resource": {
                                return (
                                    (bundle as IEditResourceBundle)
                                        .resourceId ===
                                    (oldBundle as IEditResourceBundle)
                                        .resourceId
                                );
                            }

                            case "edit-controller": {
                                return (
                                    (bundle as IEditControllerBundle)
                                        .controllerId ===
                                    (oldBundle as IEditControllerBundle)
                                        .controllerId
                                );
                            }

                            case "edit-query": {
                                return (
                                    (bundle as IEditQueryBundle).queryId ===
                                    (oldBundle as IEditQueryBundle).queryId
                                );
                            }
                        }

                        return false;
                    });
                    if (oldTab) {
                        /*
                         * At this point, for the first time, `newCount` will be
                         * off by one. On repeating `x` times, `newCount` will be
                         * off by `x`. However, we need not worry because `newCount`
                         * is temporarily used for `edit-*` tab types.
                         */
                        setActiveTab(oldTab.id);
                        return oldTabs;
                    }

                    const newTabId = uuid.v4();
                    const newTab = {
                        id: newTabId,
                        title: `${tabDetails.title} ${newCount}`,
                        icon: tabDetails.icon,
                        type,
                        bundle,
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
                                path: `${tabDetails.title} ${newCount}`,
                            },
                        ]);
                    }

                    const result = [...oldTabs];
                    result.splice(index, replace ? 1 : 0, newTab);
                    return result;
                });

                return { ...oldCount, [type]: newCount };
            });
        },
        createTab: (type: TTabType, bundle?: TBundleType) => {
            builderActions.insertTab(tabs.length, false, type, bundle);
        },
        replaceTab: (index: number, type: TTabType, bundle?: TBundleType) => {
            builderActions.insertTab(index, true, type, bundle);
        },

        setTabTitle: (index: number, title: string): void => {
            setTabs((oldTabs) => {
                /*
                 * Do not update the title, if the specified title is already
                 * equal to the current title. Otherwise, an infinite loop will
                 * be triggered.
                 */
                const oldTab = oldTabs[index];
                if (oldTab.title === title) {
                    return oldTabs;
                }

                const result = [...oldTabs];
                result.splice(index, 1, {
                    ...oldTab,
                    title,
                });
                return result;
            });
        },

        closeTab: (index: number): void => {
            setTabs((oldTabs) => {
                const result = [...oldTabs];
                result.splice(index, 1);

                if (result.length > 0) {
                    setActiveTab(result[result.length - 1].id);
                }

                return result;
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

    const renderTabContent = (tab: ITab, index: number) => {
        const { id, type } = tab;
        const active = id === activeTab;
        return (
            <div
                key={tab.id}
                style={{
                    display: active ? "block" : "none",
                    width: "100%",
                    height: "auto",
                }}
            >
                <TabContext.Provider value={{ tab, index, active }}>
                    {type === "new-controller" && <NewControllerEditor />}
                    {type === "edit-controller" && (
                        <CodeEditor
                            onChange={handleMonacoChange as any}
                            path={activeTab as string}
                        />
                    )}
                    {type === "new-screen" && <NewScreenEditor />}
                    {type === "edit-screen" && <CanvasEditor />}
                    {type === "new-resource" && <NewResourceEditor />}
                    {type === "edit-resource" && (
                        <ResourceEditor
                            resourceId={
                                (tab.bundle as IEditResourceBundle).resourceId
                            }
                        />
                    )}
                    {type === "new-query" && <NewQueryEditor />}
                </TabContext.Provider>
            </div>
        );
    };

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
                            <Content>{tabs.map(renderTabContent)}</Content>
                        </Main>
                        <RightDrawer
                            open={
                                rightDrawerOpen &&
                                ["new-screen", "edit-screen"].includes(
                                    activeTabType || "<invalid>",
                                )
                            }
                            onDrawerClose={handleRightDrawerClose}
                        />
                    </Root>
                </ArtifactsContext.Provider>
            </BuilderActionsContext.Provider>
        </Editor>
    );
};

export default AppBuilder;

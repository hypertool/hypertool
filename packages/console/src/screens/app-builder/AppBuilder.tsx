import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { styled } from "@mui/material/styles";

import { gql, useMutation } from "@apollo/client";

import * as uuid from "uuid";
import { useParams } from "react-router-dom";

import {
    BuilderActionsContext,
    ModulesContext,
    TabContext,
} from "../../contexts";
import { Editor, useEditor } from "../../craft";
import { useModules } from "../../hooks";
import { nodeMappings } from "../../nodes";
import type {
    IBuilderActionsContext,
    IEditControllerBundle,
    IEditQueryBundle,
    IEditResourceBundle,
    IEditScreenBundle,
    ITab,
    TBundleType,
    TTabType,
} from "../../types";
import { constants } from "../../utils";
import QueryEditor from "../edit-query";
import ResourceEditor from "../edit-resource";
import NewControllerEditor from "../new-controller";
import NewQueryEditor from "../new-query";
import NewResourceEditor from "../new-resource";
import NewScreenEditor from "../new-screen";

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

const UPDATE_SCREEN = gql`
    mutation UpdateScreen($screenId: ID!, $content: String!) {
        updateScreen(screenId: $screenId, content: $content) {
            id
        }
    }
`;

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

    const { appId } = useParams();
    if (!appId) {
        throw new Error("App ID is undefined in URL!");
    }

    const modules = useModules(appId);
    const { actions, query } = useEditor();
    const [
        updateScreen,
        /*
         * {
         *     loading: updatingScreen,
         *     data: updatedScreen,
         *     error: updateScreenError,
         * },
         */
    ] = useMutation(UPDATE_SCREEN);

    const { type: activeTabType, bundle: activeTabBundle } = useMemo(
        () =>
            tabs.find((tab) => tab.id === activeTab) || {
                type: undefined,
                bundle: undefined,
            },
        [activeTab, tabs],
    );

    /*
     * TODO: For some reason, `useMemo` causes binding issues in callbacks
     * resulting in incomprehensible behavior.
     */
    const builderActions: IBuilderActionsContext = {
        tabs,
        activeTab,

        setActiveTab: (newActiveTabId: string) => {
            if (activeTab && activeTabType === "edit-screen") {
                const content = query.serialize();
                localStorage.setItem(activeTab, content);
                updateScreen({
                    variables: {
                        screenId: (activeTabBundle as IEditScreenBundle)
                            .screenId,
                        content,
                    },
                });
            }

            /*
             * If the new active tab is being inserted to the tabs list, then we
             * do not bother with deserializing anything.
             */
            const newActiveTab = tabs.find((tab) => tab.id === newActiveTabId);
            if (newActiveTab && newActiveTab.type === "edit-screen") {
                const json = localStorage.getItem(newActiveTabId);
                if (json) {
                    actions.deserialize(json);
                }
            }

            setActiveTab(newActiveTabId);
        },

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
                                    (bundle as IEditQueryBundle)
                                        .queryTemplateId ===
                                    (oldBundle as IEditQueryBundle)
                                        .queryTemplateId
                                );
                            }

                            case "edit-screen": {
                                return (
                                    (bundle as IEditScreenBundle).screenId ===
                                    (oldBundle as IEditScreenBundle).screenId
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
                        builderActions.setActiveTab(oldTab.id);
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
                    builderActions.setActiveTab(newTabId);

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
                    builderActions.setActiveTab(result[result.length - 1].id);
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
                        <CodeEditor path={activeTab as string} />
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
                    {type === "edit-query" && <QueryEditor />}
                    {type === "new-query" && <NewQueryEditor />}
                </TabContext.Provider>
            </div>
        );
    };

    return (
        <BuilderActionsContext.Provider value={builderActions}>
            <ModulesContext.Provider value={modules}>
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
                            rightDrawerOpen && "edit-screen" === activeTabType
                        }
                        onDrawerClose={handleRightDrawerClose}
                        activeTabBundle={activeTabBundle}
                    />
                </Root>
            </ModulesContext.Provider>
        </BuilderActionsContext.Provider>
    );
};

const AppBuilderWrapper = () => {
    return (
        <Editor resolver={nodeMappings} onRender={RenderNode}>
            <AppBuilder />
        </Editor>
    );
};

export default AppBuilderWrapper;

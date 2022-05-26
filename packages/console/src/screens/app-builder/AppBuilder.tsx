import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { styled } from "@mui/material/styles";

import * as uuid from "uuid";

import {
    BuilderActionsContext,
    ModulesContext,
    TabContext,
} from "../../contexts";
import { Editor } from "../../craft";
import { useModules, useParam } from "../../hooks";
import { nodeMappings } from "../../nodes";
import type {
    IBuilderActionsContext,
    IEditControllerBundle,
    IEditQueryBundle,
    IEditResourceBundle,
    IEditScreenBundle,
    IEditUserBundle,
    ITab,
    TBundleType,
    TPredicate,
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
import {
    NewProviderEditor,
    NewUserEditor,
    UserEditor,
    ViewProviders,
    ViewUsers,
} from "./modules/authentication";
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

interface ITabTypeDetails {
    icon: string;
    title: string;
    component: FunctionComponent;
}

const tabDetailsByType: Record<string, ITabTypeDetails> = {
    "new-query": {
        icon: "workspaces",
        title: "New Query",
        component: NewQueryEditor,
    },
    "edit-query": {
        icon: "workspaces",
        title: "Edit Query",
        component: QueryEditor,
    },
    "new-controller": {
        icon: "code",
        title: "New Controller",
        component: NewControllerEditor,
    },
    "edit-controller": {
        icon: "code",
        title: "Edit Controller",
        component: CodeEditor,
    },
    "new-screen": {
        icon: "wysiwyg",
        title: "New Screen",
        component: NewScreenEditor,
    },
    "edit-screen": {
        icon: "wysiwyg",
        title: "Edit Screen",
        component: CanvasEditor,
    },
    "new-resource": {
        icon: "category",
        title: "New Resource",
        component: NewResourceEditor,
    },
    "edit-resource": {
        icon: "category",
        title: "Edit Resource",
        component: ResourceEditor,
    },
    "authentication.new-user": {
        icon: "account_circle",
        title: "New User",
        component: NewUserEditor,
    },
    "authentication.edit-user": {
        icon: "account_circle",
        title: "Edit User",
        component: UserEditor,
    },
    "authentication.view-users": {
        icon: "people",
        title: "Users",
        component: ViewUsers,
    },
    "authentication.new-provider": {
        icon: "password",
        title: "New Provider",
        component: NewProviderEditor,
    },
    "authentication.view-providers": {
        icon: "password",
        title: "Providers",
        component: ViewProviders,
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
    const appId = useParam("appId");

    const modules = useModules(appId);

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

        setActiveTab: async (newActiveTabId: string) => {
            /*
             * If the new active tab is being inserted to the tabs list, then we
             * do not bother with deserializing anything.
             */
            const newActiveTab = tabs.find((tab) => tab.id === newActiveTabId);
            if (newActiveTab && newActiveTab.type === "edit-screen") {
                const jsonString = localStorage.getItem("nodes");
                if (jsonString) {
                    const json =
                        JSON.parse(jsonString)[
                            (newActiveTab.bundle as IEditScreenBundle).screenId
                        ];
                    /*
                     * When the tab is activated for the very first time, the
                     * key should be missing. `CanvasEditor` will download
                     * the content from the API and update the local storage.
                     * Thus, from subsequent activations, content from the local
                     * storage will be used.
                     */
                    if (json) {
                        actions.deserialize(json);
                    }
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
                            case "authentication.view-users":
                            case "authentication.view-providers": {
                                return true;
                            }

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

                            case "authentication.edit-user": {
                                return (
                                    (bundle as IEditUserBundle).userId ===
                                    (oldBundle as IEditUserBundle).userId
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

        closeTabs: (predicate: TPredicate<ITab>): void => {
            setTabs((oldTabs) => {
                const newTabs = oldTabs.filter((tab) => !predicate(tab));
                if (
                    !newTabs.find((newTab: ITab) => newTab.id === activeTab) &&
                    newTabs.length > 0
                ) {
                    builderActions.setActiveTab(newTabs[newTabs.length - 1].id);
                }

                return newTabs;
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
        const Component = tabDetailsByType[type].component;
        return (
            active && (
                <div
                    key={tab.id}
                    style={{
                        display: active ? "block" : "none",
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <TabContext.Provider value={{ tab, index, active }}>
                        <Component />
                        {type === "edit-screen" && (
                            <RightDrawer
                                open={
                                    rightDrawerOpen &&
                                    "edit-screen" === activeTabType
                                }
                                onDrawerClose={handleRightDrawerClose}
                                activeTabBundle={activeTabBundle}
                            />
                        )}
                    </TabContext.Provider>
                </div>
            )
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

import { FunctionComponent, ReactElement, useCallback } from "react";
import { useMemo, useState } from "react";

import { styled } from "@mui/material/styles";

import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
    gql,
    useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { ConfirmProvider } from "material-ui-confirm";
import { Navigate, Route, Routes } from "react-router-dom";

import { Splash } from "./components";
import { NotificationProvider, RootAppContext } from "./contexts";
import SessionContext from "./contexts/SessionContext";
import { VisitorLayout, WorkspaceLayout } from "./layouts";
import {
    AppBuilder,
    AuthenticationServices,
    CreateAccount,
    Installation,
    InviteUser,
    Login,
    NewApp,
    NewOrganization,
    NewPassword,
    NewTeam,
    UpdatePassword,
    VerificationEmailSent,
    ViewApp,
    ViewApps,
    ViewOrganization,
    ViewOrganizations,
    ViewTeam,
    ViewUser,
} from "./screens";
import type { ISession, ISessionContext } from "./types";
import { useNavigate } from "./hooks";
import ESBuildProvider from "./contexts/ESBuildProvider";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
}));

const createPrivateClient = (session: ISession) => {
    const httpLink = new HttpLink({
        uri: `${process.env.REACT_APP_API_URL}/graphql/v1/private`,
        fetch,
    });
    const authLink = setContext((_, { headers }) => ({
        headers: {
            ...headers,
            authorization: `Bearer ${session.jwtToken}`,
        },
    }));
    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
};

const publicClient = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}/graphql/v1/public`,
    cache: new InMemoryCache(),
});

const GET_ROOT_APP = gql`
    query GetRootApp {
        getRootApp {
            id
            name
            title
        }
    }
`;

const App: FunctionComponent = (): ReactElement => {
    const setReload = useState(false)[1];
    const navigate = useNavigate();

    const handleReload = useCallback(() => {
        /*
         * NOTE: Do not use `setReload(true)` here, because React re-renders
         * only when the state changes, not when `setState` is called.
         */
        setReload((reload) => !reload);
        navigate("/apps");
    }, [navigate, setReload]);

    const context: ISessionContext = useMemo(() => {
        const json = localStorage.getItem("session");
        if (!json) {
            return { reload: handleReload, client: publicClient };
        }

        const session: ISession = JSON.parse(json);
        return {
            ...session,
            client: createPrivateClient(session),
            reload: handleReload,
        };
    }, [handleReload]);

    const { data, loading } = useQuery(GET_ROOT_APP, {
        notifyOnNetworkStatusChange: true,
        client: publicClient,
    });
    const rootApp = data?.getRootApp;

    if (loading) {
        return <Splash />;
    }

    const ConfirmProvider0 = ConfirmProvider as any;

    return (
        <Root>
            <ESBuildProvider>
                <SessionContext.Provider value={context}>
                    <ApolloProvider client={context.client}>
                        <ConfirmProvider0>
                            <NotificationProvider>
                                <RootAppContext.Provider value={rootApp}>
                                    <Routes>
                                        {!rootApp && (
                                            <>
                                                <Route
                                                    path="/installation"
                                                    element={<Installation />}
                                                />
                                                <Route
                                                    index={true}
                                                    element={
                                                        <Navigate
                                                            to={"/installation"}
                                                        />
                                                    }
                                                />
                                            </>
                                        )}
                                        {rootApp && (
                                            <>
                                                {!context.jwtToken && (
                                                    <Route
                                                        path="/"
                                                        element={
                                                            <VisitorLayout />
                                                        }
                                                    >
                                                        <Route
                                                            path="/login"
                                                            element={<Login />}
                                                        />
                                                        <Route
                                                            path="/create-account"
                                                            element={
                                                                <CreateAccount />
                                                            }
                                                        />
                                                        <Route
                                                            path="/new-password"
                                                            element={
                                                                <NewPassword />
                                                            }
                                                        />
                                                        <Route
                                                            path="/verification-email-sent"
                                                            element={
                                                                <VerificationEmailSent />
                                                            }
                                                        />
                                                        <Route
                                                            index={true}
                                                            element={
                                                                <Navigate
                                                                    to={
                                                                        "/login"
                                                                    }
                                                                />
                                                            }
                                                        />
                                                    </Route>
                                                )}

                                                {context.jwtToken && (
                                                    <>
                                                        <Route
                                                            path="/"
                                                            element={
                                                                <WorkspaceLayout />
                                                            }
                                                        >
                                                            {/* Routes associated with Organizations */}
                                                            <Route
                                                                path="/organizations"
                                                                element={
                                                                    <ViewOrganizations />
                                                                }
                                                            />
                                                            <Route
                                                                path="/organizations/new"
                                                                element={
                                                                    <NewOrganization />
                                                                }
                                                            />
                                                            <Route
                                                                path="/organizations/:organizationId"
                                                                element={
                                                                    <ViewOrganization />
                                                                }
                                                            />

                                                            {/* Routes associated with Teams */}
                                                            <Route
                                                                path="/teams/:teamId"
                                                                element={
                                                                    <ViewTeam />
                                                                }
                                                            />
                                                            <Route
                                                                path="/teams/new"
                                                                element={
                                                                    <NewTeam />
                                                                }
                                                            />

                                                            {/* Routes associated with Users */}
                                                            <Route
                                                                path="/:username"
                                                                element={
                                                                    <ViewUser />
                                                                }
                                                            />
                                                            <Route
                                                                path="/update-password"
                                                                element={
                                                                    <UpdatePassword />
                                                                }
                                                            />
                                                            <Route
                                                                path="/invite-user"
                                                                element={
                                                                    <InviteUser />
                                                                }
                                                            />

                                                            {/* Routes associated with Apps */}
                                                            <Route
                                                                path="/apps"
                                                                element={
                                                                    <ViewApps />
                                                                }
                                                            />
                                                            <Route
                                                                path="/apps/new"
                                                                element={
                                                                    <NewApp />
                                                                }
                                                            />
                                                            <Route
                                                                path="/apps/:appId"
                                                                element={
                                                                    <ViewApp />
                                                                }
                                                            />
                                                            <Route
                                                                path="/apps/:appId/authentication"
                                                                element={
                                                                    <AuthenticationServices />
                                                                }
                                                            />
                                                        </Route>

                                                        <Route
                                                            path="/apps/:appId/builder"
                                                            element={
                                                                <AppBuilder />
                                                            }
                                                        />

                                                        <Route
                                                            index={true}
                                                            element={
                                                                <Navigate
                                                                    to={"/apps"}
                                                                />
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Routes>
                                </RootAppContext.Provider>
                            </NotificationProvider>
                        </ConfirmProvider0>
                    </ApolloProvider>
                </SessionContext.Provider>
            </ESBuildProvider>
        </Root>
    );
};

export default App;

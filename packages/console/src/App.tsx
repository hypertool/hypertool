/* eslint-disable no-undef */
import type { FunctionComponent, ReactElement } from "react";
import { useMemo, useState } from "react";

import { styled } from "@mui/material/styles";

import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import type { Session } from "@hypertool/common";

import { Navigate, Route, Routes } from "react-router-dom";

import SessionContext from "./contexts/SessionContext";
import { VisitorLayout, WorkspaceLayout } from "./layouts";
import {
    AppBuilder,
    AuthenticationServices,
    CreateAccount,
    InviteUser,
    Login,
    NewApp,
    NewOrganization,
    NewPassword,
    NewTeam,
    ResourceLibrary,
    UpdatePassword,
    ViewApp,
    ViewApps,
    ViewOrganization,
    ViewOrganizations,
    ViewTeam,
    ViewUser,
} from "./screens";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
}));

const createPrivateClient = (session: Session) => {
    const httpLink = new HttpLink({
        uri: `${process.env.REACT_APP_API_URL}/graphql/v1/private`,
        fetch,
    });
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${session.jwtToken}`,
            },
        };
    });
    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
};

const App: FunctionComponent = (): ReactElement => {
    const [reload, setReload] = useState(false);

    const { client, session } = useMemo(() => {
        const session = localStorage.getItem("session");
        if (session) {
            return {
                client: createPrivateClient(JSON.parse(session)),
                session,
            };
        }
        return { client: null, session };
    }, [reload]);

    const sessionContext = {
        reloadSession: () => {
            setReload(true);
        },
    };

    return (
        <Root>
            <SessionContext.Provider value={sessionContext}>
                <Routes>
                    <Route path="/" element={<VisitorLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/create-account"
                            element={<CreateAccount />}
                        />
                        <Route path="/new-password" element={<NewPassword />} />
                        <Route
                            index={true}
                            element={<Navigate to={"/login"} />}
                        />
                    </Route>
                </Routes>

                {client && (
                    <ApolloProvider client={client as any}>
                        <Routes>
                            <Route path="/" element={<WorkspaceLayout />}>
                                {/* Routes associated with Organizations */}
                                <Route
                                    path="/organizations"
                                    element={<ViewOrganizations />}
                                />
                                <Route
                                    path="/organizations/new"
                                    element={<NewOrganization />}
                                />
                                <Route
                                    path="/organizations/:organizationId"
                                    element={<ViewOrganization />}
                                />

                                {/* Routes associated with Teams */}
                                <Route
                                    path="/teams/:teamId"
                                    element={<ViewTeam />}
                                />
                                <Route
                                    path="/teams/new"
                                    element={<NewTeam />}
                                />

                                {/* Routes associated with Users */}
                                <Route
                                    path="/:username"
                                    element={<ViewUser />}
                                />
                                <Route
                                    path="/update-password"
                                    element={<UpdatePassword />}
                                />
                                <Route
                                    path="/invite-user"
                                    element={<InviteUser />}
                                />

                                {/* Routes associated with Apps */}
                                <Route path="/apps" element={<ViewApps />} />
                                <Route path="/apps/new" element={<NewApp />} />
                                <Route
                                    path="/apps/:appId"
                                    element={<ViewApp />}
                                />
                                <Route
                                    path="/apps/:appId/authentication"
                                    element={<AuthenticationServices />}
                                />
                            </Route>

                            <Route
                                path="/apps/:appId/builder"
                                element={<AppBuilder />}
                            />

                            <Route
                                path="/login"
                                element={<Navigate to={"/apps"} />}
                            />

                            <Route
                                index={true}
                                element={<Navigate to={"/apps"} />}
                            />
                        </Routes>
                    </ApolloProvider>
                )}
            </SessionContext.Provider>
        </Root>
    );
};

export default App;

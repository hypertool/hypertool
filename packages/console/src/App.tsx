import type { FunctionComponent, ReactElement } from "react";

import { styled } from "@mui/material/styles";

import { Navigate, Route, Routes } from "react-router-dom";

import { AppBuilderLayout, VisitorLayout, WorkspaceLayout } from "./layouts";
import {
    AppBuilder,
    AuthenticationServices,
    EditResource,
    Login,
    NewApp,
    NewOrganization,
    NewResource,
    ResourceLibrary,
    SingleApp,
    ViewApps,
} from "./screens";

const Root = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
}));

const App: FunctionComponent = (): ReactElement => {
    const session = localStorage.getItem("session");
    return (
        <Root>
            <Routes>
                <Route path="/" element={<VisitorLayout />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route path="/" element={<WorkspaceLayout />}>
                    <Route
                        path="/organizations/new"
                        element={<NewOrganization />}
                    />
                    <Route path="/apps" element={<ViewApps />} />
                    <Route path="/apps/new" element={<NewApp />} />
                    <Route path="/resources" element={<ResourceLibrary />} />
                    <Route path="/resources/new" element={<NewResource />} />
                    <Route
                        path="/resources/:resourceId/edit"
                        element={<EditResource />}
                    />
                    <Route path="/apps/:appId" element={<SingleApp />} />
                    <Route
                        path="/apps/:appId/authentication"
                        element={<AuthenticationServices />}
                    />
                </Route>
                <Route path="/" element={<AppBuilderLayout />}>
                    <Route
                        path="/apps/:appId/builder"
                        element={<AppBuilder />}
                    />
                </Route>
                <Route
                    index={true}
                    element={<Navigate to={session ? "/apps" : "/login"} />}
                />
            </Routes>
        </Root>
    );
};

export default App;

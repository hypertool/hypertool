import type { FunctionComponent, ReactElement } from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

import {
  Login,
  NewOrganization,
  ViewApps,
  NewApp,
  ResourceLibrary,
  NewResource,
  EditResource,
} from "./screens";
import { WorkspaceLayout } from "./layouts";

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));

const App: FunctionComponent = (): ReactElement => {
  return (
    <Root>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<WorkspaceLayout />}>
          <Route path="/organizations/new" element={<NewOrganization />} />
          <Route path="/apps" element={<ViewApps />} />
          <Route path="/apps/new" element={<NewApp />} />
          <Route path="/resources" element={<ResourceLibrary />} />
          <Route path="/resources/new" element={<NewResource />} />
          <Route
            path="/resources/:resourceId/edit"
            element={<EditResource />}
          />
        </Route>
        <Route index={true} element={<Navigate to="/apps" />} />
      </Routes>
    </Root>
  );
};

export default App;

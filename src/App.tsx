import type { FunctionComponent, ReactElement } from "react";

import { Routes, Route } from "react-router-dom";
import { styled } from "@mui/material/styles";

import {
  Login,
  Test,
  ViewApps,
  NewApp,
  ResourceLibrary,
  NewResource,
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
        <Route path="/test" element={<Test />} />
        <Route path="/" element={<WorkspaceLayout />}>
          <Route path="/apps" element={<ViewApps />} />
          <Route path="/apps/new" element={<NewApp />} />
          <Route path="/resource-library" element={<ResourceLibrary />} />
          <Route path="/resources/new" element={<NewResource />} />
        </Route>
      </Routes>
    </Root>
  );
};

export default App;

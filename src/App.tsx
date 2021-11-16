import type { FunctionComponent, ReactElement } from "react";

import { Routes, Route } from "react-router-dom";
import { styled } from "@mui/material/styles";

import { Login, Test } from "./screens";
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
        <Route path="/" element={<WorkspaceLayout />}></Route>
      </Routes>
    </Root>
  );
};

export default App;

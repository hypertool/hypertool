import type { FunctionComponent, ReactElement } from "react";

import {
  Routes,
  Route
} from "react-router-dom";
import { styled } from "@mui/material/styles";

import { Login, Test } from "./screens";

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
      </Routes>
    </Root>);
}

export default App;

import type { FunctionComponent, ReactElement } from "react";

import {
  Routes,
  Route
} from "react-router-dom";

import { Login, Test } from "./screens"; 

const App: FunctionComponent = (): ReactElement => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<Test />} />
    </Routes>);
}

export default App;

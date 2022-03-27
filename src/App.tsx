import type { FunctionComponent, ReactElement } from "react";
import { AppContext } from "./contexts";
import { useFetchApp } from "./hooks";

const App: FunctionComponent = (): ReactElement => {
  const app = useFetchApp();
  return (
    <AppContext.Provider value={app}>
      <div>Hello, world!</div>
    </AppContext.Provider>
  );
};

export default App;

import type { FunctionComponent, ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContext } from "./contexts";
import { useFetchApp } from "./hooks";
import { IScreen } from "./types";
import { Screen } from "./components";

const App: FunctionComponent = (): ReactElement => {
  const app = useFetchApp();

  const renderRoute = (screen: IScreen) => (
    <Route
      key={screen.id}
      path={`/${screen.slug}`}
      element={
        <Screen
          slug={screen.slug}
          title={screen.title}
          content={screen.content}
        />
      }
    />
  );

  const renderRoutes = () => (
    <Routes>{app && app.screens.map(renderRoute)}</Routes>
  );

  return (
    <AppContext.Provider value={app}>
      <BrowserRouter>{renderRoutes()}</BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;

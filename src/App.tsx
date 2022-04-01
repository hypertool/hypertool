import { FunctionComponent, ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContext, ControllersContext } from "./contexts";
import { useControllers, useFetchApp } from "./hooks";
import type { IScreen } from "./types";
import { Screen } from "./components";

const App: FunctionComponent = (): ReactElement => {
  const app = useFetchApp();
  const controllers = useControllers(app);

  const renderRoute = (screen: IScreen) => (
    <Route
      key={screen.id}
      path={`/${screen.slug}`}
      element={
        <Screen
          slug={screen.slug}
          title={screen.title}
          content={screen.content}
          controller={screen.controller.patched}
        />
      }
    />
  );

  const renderRoutes = () => (
    <Routes>{app && app.screens.map(renderRoute)}</Routes>
  );

  return (
    <AppContext.Provider value={app}>
      <ControllersContext.Provider value={controllers}>
        <BrowserRouter>{renderRoutes()}</BrowserRouter>
      </ControllersContext.Provider>
    </AppContext.Provider>
  );
};

export default App;

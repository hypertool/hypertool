import type { FunctionComponent, ReactElement } from "react";

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import type { Hypertool, Route as HypertoolRoute } from "../types";

import Instantiate from "./Instantiate";
import { Error404 } from "../screens";

const ApplicationRouter: FunctionComponent = (): ReactElement => {
    const renderRoute = (route: HypertoolRoute) => {
        const { uri, path } = route;
        const sanitizedUri = uri.replace("@", ":");

        return (
            <Route
                key={uri}
                path={sanitizedUri}
                element={<Instantiate path={path} />}
            />
        );
    };

    const renderRoutes = () => {
        const hypertool = (window as any).hypertool as Hypertool;
        return hypertool.routes.map(renderRoute);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrowserRouter>
                <Routes>
                    {renderRoutes()}
                    <Route path="/error/404" element={<Error404 />} />
                    <Route path="*" element={<Navigate to="/error/404" />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

export default ApplicationRouter;

import type { FunctionComponent, ReactElement } from "react";

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import type { Hypertool, Route as HypertoolRoute } from "../types";

import Instantiate, { Props as InstantiateProps } from "./Instantiate";

export interface Props {
    screens: {
        error404: string;
    };
    resolver: (path: string) => Promise<any>;
}

const ApplicationRouter: FunctionComponent<Props> = (
    props: Props,
): ReactElement => {
    const { screens, resolver } = props;

    const renderRoute = (route: HypertoolRoute) => {
        const { uri, path } = route;
        const sanitizedUri = uri.replace("@", ":");

        return (
            <Route
                key={uri}
                path={sanitizedUri}
                element={<Instantiate path={path} resolver={resolver} />}
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
                    <Route
                        path="*"
                        element={<Navigate to={screens.error404} />}
                    />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};

ApplicationRouter.defaultProps = {
    screens: {
        error404: "/error/404",
    },
};

export default ApplicationRouter;

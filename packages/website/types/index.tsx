import type { ReactElement } from "react";

import type { NextPage } from "next";
import type { AppProps } from "next/app";

export type Page<T = {}> = NextPage<T> & {
    getLayout?: (children: ReactElement) => ReactElement;
};

export type AppPropsWithLayout<T = {}> = AppProps<T> & {
    Component: Page<T>;
};

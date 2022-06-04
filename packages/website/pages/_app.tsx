import type { FunctionComponent } from "react";
import { useEffect } from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Head from "next/head";
import { useRouter } from "next/router";

import { theme } from "../components/common";
import type { AppPropsWithLayout } from "../types";

const MyApp: FunctionComponent<AppPropsWithLayout> = (
    props: AppPropsWithLayout,
) => {
    const { Component: UncastedComponent, pageProps } = props;
    const router = useRouter();

    const Component = UncastedComponent as any;

    const getLayout = Component.getLayout || ((children: any) => children);

    useEffect(() => {
        /* Remove the server-side injected CSS. */
        const jssStyles = document.querySelector("#jss-server-side");
        jssStyles?.parentElement?.removeChild(jssStyles);
    }, []);

    return (
        <>
            <Head>
                <title>Hypertool</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
        </>
    );
};

export default MyApp;

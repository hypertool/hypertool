import type { ReactElement } from "react";

import { styled } from "@mui/material/styles";

import Head from "next/head";

import { Features, Hero, Hosting, Problems } from "../components/landing";
import { VisitorLayout } from "../components/layouts";
import type { Page } from "../types";

const Container = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}));

const Home: Page = () => {
    return (
        <div>
            <Head>
                <title>Hypertool</title>
                <meta
                    name="description"
                    content="Hypertool is a platform for building internal tools rapidly."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container>
                <Hero />
                <Problems />
                <Features />
                <Hosting />
            </Container>
        </div>
    );
};

Home.getLayout = function getLayout(children: ReactElement): ReactElement {
    return <VisitorLayout>{children}</VisitorLayout>;
};

export default Home;

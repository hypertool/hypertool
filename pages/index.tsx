import type { ReactElement } from "react";

import Head from "next/head";

import type { Page } from "../types";

import { VisitorLayout } from "../components/layouts";

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
      <p>Hello, world!</p>
    </div>
  );
};

Home.getLayout = function getLayout(children: ReactElement): ReactElement {
  return <VisitorLayout>{children}</VisitorLayout>;
};

export default Home;

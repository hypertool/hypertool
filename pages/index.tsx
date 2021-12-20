import type { NextPage } from "next";

import Head from "next/head";

const Home: NextPage = () => {
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

export default Home;

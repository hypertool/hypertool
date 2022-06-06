import { styled } from "@mui/material";
import Head from "next/head";
import type { ReactElement } from "react";
import { Blog } from "../../components/blogs";
import { VisitorLayout } from "../../components/layouts";
import type { Page } from "../../types";
import { Container as MuiContainer } from "@mui/material";

const Container = styled(MuiContainer)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: theme.spacing(2),
    gap: theme.spacing(2),
}));

const blogs = [
    {
        slug: "how-to-implement-a-health-check-in-node-js",
        title: "How to implement a health check in Node.js",
        description:
            "Learn how to build strongly typed polymorphic React components with TypeScript, using familiar UI component props as guides.",
        author: "Samuel Rowe",
    },
    {
        slug: "how-to-implement-a-health-check-in-node-js",
        title: "How to implement a health check in Node.js",
        description:
            "Learn how to build strongly typed polymorphic React components with TypeScript, using familiar UI component props as guides.",
        author: "Samuel Rowe",
    },
    {
        slug: "how-to-implement-a-health-check-in-node-js",
        title: "How to implement a health check in Node.js",
        description:
            "Learn how to build strongly typed polymorphic React components with TypeScript, using familiar UI component props as guides.",
        author: "Samuel Rowe",
    },
    {
        slug: "how-to-implement-a-health-check-in-node-js",
        title: "How to implement a health check in Node.js",
        description:
            "Learn how to build strongly typed polymorphic React components with TypeScript, using familiar UI component props as guides.",
        author: "Samuel Rowe",
    },
    {
        slug: "how-to-implement-a-health-check-in-node-js",
        title: "How to implement a health check in Node.js",
        description:
            "Learn how to build strongly typed polymorphic React components with TypeScript, using familiar UI component props as guides.",
        author: "Samuel Rowe",
    },
];

const Blogs: Page = (): ReactElement => {
    return (
        <>
            <Head>
                <title>Hypertool Blog</title>
                <meta
                    name="description"
                    content="Hypertool is a platform for building internal tools rapidly."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container>
                {blogs.map((blog) => (
                    <Blog
                        key={blog.slug}
                        slug={blog.slug}
                        title={blog.title}
                        description={blog.description}
                        author={blog.author}
                    />
                ))}
            </Container>
        </>
    );
};

Blogs.getLayout = function getLayout(children: ReactElement): ReactElement {
    return <VisitorLayout>{children}</VisitorLayout>;
};

export default Blogs;

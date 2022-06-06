import { styled, Typography } from "@mui/material";
import Head from "next/head";
import type { ReactElement } from "react";
import { VisitorLayout } from "../../../components/layouts";
import type { Page } from "../../../types";
import { Container as MuiContainer } from "@mui/material";

const Container = styled(MuiContainer)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    gap: theme.spacing(2),
}));

const Limiter = styled("div")(({ theme }) => ({
    width: 800,
}));

const Title = styled(Typography)({
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 1.2,
});

const Image = styled("img")(({ theme }) => ({
    width: "100%",
    height: "auto",
    marginTop: theme.spacing(4),
}));

const Content = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(4, 0, 4, 0),
}));

export interface IBlogProps {
    title: string;
    description: string;
    content: string;
    imageURL: string;
}

const Blog: Page<IBlogProps> = (props: IBlogProps): ReactElement => {
    const { title, description, content, imageURL } = props;
    return (
        <>
            <Head>
                <title>{title} | Hypertool Blog</title>
                <meta name="description" content={description} />
            </Head>

            <Container>
                <Limiter>
                    <Title>{title}</Title>
                    <Image src={imageURL} alt={title} />
                    <Content>{content}</Content>
                </Limiter>
            </Container>
        </>
    );
};

Blog.getLayout = function getLayout(children: ReactElement): ReactElement {
    return <VisitorLayout>{children}</VisitorLayout>;
};

export async function getStaticProps() {
    return {
        props: {
            title: "How to implement a health check in Node.js",
            description:
                "Learn how to build strongly typed polymorphic React components with TypeScript, using familiar UI component props as guides.",
            content:
                "Learn how to build strongly typed polymorphic React components with TypeScript, using familiar UI component props as guides.",
            imageURL:
                "https://blog.logrocket.com/wp-content/uploads/2022/06/ultimate-guide-abortcontroller-node-js.png",
        },
    };
}

export async function getStaticPaths() {
    return {
        paths: [
            {
                params: {
                    slug: "how-to-implement-a-health-check-in-node-js",
                },
            },
        ],
        fallback: false,
    };
}

export default Blog;

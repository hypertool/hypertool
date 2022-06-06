import type { ReactElement, FunctionComponent } from "react";

import {
    Card,
    CardContent,
    CardMedia,
    styled,
    Typography,
} from "@mui/material";
import Link from "next/link";

export interface IBlogProps {
    slug: string;
    title: string;
    description: string;
    author: string;
}

const BlogCard = styled(Card)(({ theme }) => ({
    width: `calc(33% - ${theme.spacing(2)})`,
}));

const BlogContent = styled(CardContent)(({ theme }) => ({}));

const BlogTitle = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: 18,
    cursor: "pointer",
    color: theme.palette.getContrastText(theme.palette.background.default),

    "&:hover": {
        opacity: 0.8,
    },
}));

const BlogDescription = styled(Typography)(({ theme }) => ({
    fontSize: 13,
    marginTop: theme.spacing(2),
}));

const Blog: FunctionComponent<IBlogProps> = (
    props: IBlogProps,
): ReactElement => {
    const { slug, title, description, author } = props;
    return (
        <BlogCard>
            <CardMedia
                component="img"
                height="240"
                image="https://picsum.photos/300/300"
            />

            <BlogContent>
                <Link href={`blogs/${slug}`}>
                    <BlogTitle>{title}</BlogTitle>
                </Link>
                <BlogDescription>{description}</BlogDescription>
            </BlogContent>
        </BlogCard>
    );
};

export default Blog;

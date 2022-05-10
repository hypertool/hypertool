import type { FunctionComponent, ReactElement } from "react";
import { useMemo } from "react";

import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import TemplateItem from "./TemplateItem";

const Root = styled("section")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: "100%",
}));

const Category = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(2),
}));

const CategoryContent = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginLeft: -8,
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    color: theme.palette.getContrastText(theme.palette.background.default),
}));

export interface ISelectTemplateStepProps {
    onChange: (sourceApp: string) => void;
    activeTemplate?: string;
}

interface ITemplate {
    id: string;
    title: string;
    imageURL: string;
}

interface ICategory {
    title: string;
    templates: ITemplate[];
}

const GET_APPS = gql`
    query GetApps($page: Int, $limit: Int) {
        getApps(page: $page, limit: $limit) {
            totalPages
            records {
                id
                title
            }
        }
    }
`;

const SelectTemplateStep: FunctionComponent<ISelectTemplateStepProps> = (
    props: ISelectTemplateStepProps,
): ReactElement => {
    const { onChange, activeTemplate } = props;
    const { loading, data } = useQuery(GET_APPS);
    const categories = useMemo(() => {
        return [
            {
                title: "General",
                templates: [
                    {
                        id: "$empty",
                        title: "Empty",
                        imageURL: "https://picsum.photos/200/100",
                    },
                ],
            },
            !loading &&
                (data?.getApps?.records?.length ?? 0 > 0) && {
                    title: "Your apps",
                    templates: (data?.getApps?.records ?? []).map(
                        (app: any) => ({
                            id: app.id,
                            title: app.title,
                            imageURL: "https://picsum.photos/200/100",
                        }),
                    ),
                },
        ].filter(Boolean);
    }, [loading, data]);

    const renderCategory = (category: ICategory) => (
        <Category>
            <CategoryTitle variant="h2">{category.title}</CategoryTitle>
            <CategoryContent>
                {category.templates.map((template) => (
                    <TemplateItem
                        key={template.id}
                        onClick={onChange}
                        selected={activeTemplate === template.id}
                        {...template}
                    />
                ))}
            </CategoryContent>
        </Category>
    );

    return <Root>{categories.map(renderCategory)}</Root>;
};

export default SelectTemplateStep;

import type { FunctionComponent, ReactElement } from "react";

import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { ResourceType, TProviderType } from "../../../../../types";

import ProviderItem from "./ProviderItem";

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

interface IProvider {
    type: TProviderType;
    title: string;
    imageURL: string;
}

interface IProviderCategory {
    title: string;
    providers: IProvider[];
}

const categories: IProviderCategory[] = [
    {
        title: "Native",
        providers: [
            {
                type: "email_password",
                title: "Email / Password",
                imageURL: "",
            },
            /*
             * {
             *     type: "phone",
             *     title: "Phone",
             *     imageURL: "",
             * },
             * {
             *     type: "anonymous",
             *     title: "Anonymous",
             *     imageURL: "",
             * },
             */
        ],
    },
    /*
     * {
     *     title: "OpenID Connect",
     *     resources: [
     *         {
     *             type: "google_oic",
     *             title: "Google",
     *             imageURL: "",
     *         },
     *         {
     *             type: "facebook_oic",
     *             title: "Facebook",
     *             imageURL: "",
     *         },
     *         {
     *             type: "twitter_oic",
     *             title: "Twitter",
     *             imageURL: "",
     *         },
     *         {
     *             type: "github_oic",
     *             title: "GitHub",
     *             imageURL: "",
     *         },
     *     ],
     * },
     */
];

interface Props {
    onChange: (type: TProviderType) => void;
    activeProvider: TProviderType | undefined;
}

const SelectStep: FunctionComponent<Props> = (props: Props): ReactElement => {
    const { onChange, activeProvider } = props;

    const renderCategory = (category: IProviderCategory) => (
        <Category>
            <CategoryTitle variant="h2">{category.title}</CategoryTitle>
            <CategoryContent>
                {category.providers.map((provider) => (
                    <ProviderItem
                        key={provider.title}
                        onClick={onChange}
                        selected={activeProvider === provider.type}
                        {...provider}
                    />
                ))}
            </CategoryContent>
        </Category>
    );

    return <Root>{categories.map(renderCategory)}</Root>;
};

export default SelectStep;

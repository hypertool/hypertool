import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { IApp } from "../types";

const client = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}/graphql/v1/public`,
    cache: new InMemoryCache(),
});

const GET_APP = gql`
    query GetApp($name: String!) {
        getAppByName(name: $name) {
            id
            name
            title
            description
            status
            createdAt
            updatedAt
            screens {
                id
                name
                title
                description
                slug
                content
                controller {
                    id
                    name
                    description
                    language
                    patched
                    status
                    createdAt
                    updatedAt
                }
                status
                createdAt
                updatedAt
            }
        }
    }
`;

export interface IFetchAppResult {
    app: IApp | null;
    loading: boolean;
}

const useFetchApp = (): IFetchAppResult => {
    const [app, setApp] = useState<IApp | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const publicDomainSuffix = `.${process.env.REACT_APP_PUBLIC_DOMAIN}`;
            const hostName = window.location.hostname;
            if (!hostName.endsWith(publicDomainSuffix)) {
                throw new Error(
                    `Custom domains are currently not supported. Expected domain "${process.env.REACT_APP_PUBLIC_DOMAIN}", but found "${hostName}".`,
                );
            }

            const appName = hostName.substring(
                0,
                hostName.length - publicDomainSuffix.length,
            );
            const result = await client.query({
                query: GET_APP,
                variables: {
                    name: appName,
                },
            });
            if (mounted) {
                setLoading(false);
                setApp(result.data.getAppByName);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return { app, loading };
};

export default useFetchApp;

import { useEffect, useMemo, useState } from "react";

import { gql, useQuery } from "@apollo/client";

import type { IModule, TModulesContext } from "../types";

const GET_QUERY_TEMPLATES = gql`
    query GetQueryTemplates($app: ID!, $page: Int, $limit: Int) {
        getQueryTemplates(app: $app, page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
            }
        }
    }
`;

const GET_CONTROLLERS = gql`
    query GetControllers($page: Int, $limit: Int) {
        getControllers(page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
                patched
            }
        }
    }
`;

/*
 * TODO: Do not inflate an artifact if the source code has not changed
 * since previous inflation.
 */
const useModules = (): TModulesContext => {
    const { data: queryTemplatesData } = useQuery(GET_QUERY_TEMPLATES, {
        variables: {
            page: 0,
            limit: 20,
            app: "61c93a931da4a79d3a109947",
        },
    });
    const { data: controllersData } = useQuery(GET_CONTROLLERS, {
        variables: {
            page: 0,
            limit: 20,
        },
    });

    const { records: queryTemplates = [] } =
        queryTemplatesData?.getQueryTemplates || {};
    const { records: controllers = [] } = controllersData?.getControllers || {};

    const queryModule: IModule = useMemo(
        () => ({
            id: "@hypertool/query",
            synthetic: true,
            symbols: queryTemplates.map((record: any) => record.name),
        }),
        [queryTemplates],
    );

    const [controllerModules, setControllerModules] =
        useState<TModulesContext>();

    useEffect(() => {
        let mounted = true;

        try {
            const result: Record<string, IModule> = {};

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (let i = 0; i < controllers.length; i++) {
                const controller = controllers[i];
                const importedModule = eval(
                    `"use strict"; (${controller.patched});`,
                );
                result[controller.name] = {
                    id: controller.name,
                    synthetic: false,
                    symbols: Object.keys(importedModule),
                };
            }

            if (mounted) {
                setControllerModules(result);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }

        return () => {
            mounted = false;
        };
    }, [controllers]);

    return {
        "@hypertool/query": queryModule,
        ...controllerModules,
    };
};

export default useModules;

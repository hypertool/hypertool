import { useCallback, useMemo } from "react";

import { TreeView } from "@mui/lab";

import FileTreeNode from "./FileTreeNode";
import { gql, useMutation, useQuery } from "@apollo/client";
import { createPathTree } from "../../../../utils/files";
import { useParam } from "../../../../hooks";
import { Icon } from "@mui/material";
import { IPathNode, TNewFileType } from "../../../../types";

const GET_SOURCE_FILES = gql`
    query GetSourceFiles($app: ID!, $page: Int, $limit: Int) {
        getSourceFiles(app: $app, page: $page, limit: $limit) {
            totalPages
            records {
                id
                name
                directory
            }
        }
    }
`;

const CREATE_SOURCE_FILE = gql`
    mutation CreateSourceFile(
        $name: String!
        $directory: Boolean!
        $content: String
        $app: ID!
    ) {
        createSourceFile(
            name: $name
            directory: $directory
            content: $content
            app: $app
        ) {
            id
        }
    }
`;

const EMPTY_SCREEN_HTX_TEMPLATE = `<fragment id="default">
    <meta>
        <title>Home | Built with Hypertool</title>
        <route path="/" weight=999 />
    </meta>
    <View id="root">
        <Button id="counter" text="[PLACEHOLDER TEXT]" />
    </View>
</fragment>
`;

const EMPTY_SCREEN_CSS_TEMPLATE = `#root {
    flex-direction: column;
    width: 100%;
    height: 100%;
}
`;

const EMPTY_SCREEN_JS_TEMPLATE = `import { useState } from "react";

const Home = () => {
    const [count, setCount] = useState(0);

    return {
        counter: {
            onClick: () => setCount(count => count + 1),
            text: \`This button was clicked \${count} times.\`
        }
    };
};
`;

interface INewFile {
    name: string;
    type: TNewFileType;
    parent: IPathNode;
}

const Controllers = () => {
    const appId = useParam("appId");
    const { data } = useQuery(GET_SOURCE_FILES, {
        variables: {
            page: 0,
            limit: 20,
            app: appId,
        },
        notifyOnNetworkStatusChange: true,
    });
    const { records } = data?.getSourceFiles || { records: [] };
    const root = useMemo(() => createPathTree(records), [records]);

    const [createSourceFile] = useMutation(CREATE_SOURCE_FILE, {
        refetchQueries: ["GetSourceFiles"],
    });

    const handleNew = useCallback(
        (values: INewFile) => {
            const { name, type, parent } = values;
            console.log(values);
            const create = (
                name: string,
                directory: boolean,
                content: string | null,
                parent: IPathNode,
            ) => {
                return createSourceFile({
                    variables: {
                        name: `${parent.path.name}/${name}`,
                        directory,
                        content,
                        app: appId,
                    },
                });
            };
            switch (type) {
                case "folder": {
                    create(name, true, null, parent);
                    break;
                }

                case "regular_file": {
                    create(name, false, null, parent);
                    break;
                }

                case "screen": {
                    // TODO: Move multiple calls operations to the API for atomicity.
                    create(`/${name}`, true, null, parent);
                    create(
                        `/${name}/${name}.htx`,
                        false,
                        EMPTY_SCREEN_HTX_TEMPLATE,
                        parent,
                    );
                    create(
                        `/${name}/${name}.css`,
                        false,
                        EMPTY_SCREEN_CSS_TEMPLATE,
                        parent,
                    );
                    create(
                        `/${name}/${name}.js`,
                        false,
                        EMPTY_SCREEN_JS_TEMPLATE,
                        parent,
                    );
                    break;
                }

                default: {
                    throw new Error(`Unknown file type "${type}".`);
                }
            }
        },
        [appId, createSourceFile],
    );

    return (
        <TreeView
            defaultExpanded={["1"]}
            defaultCollapseIcon={<Icon>keyboard_arrow_down</Icon>}
            defaultExpandIcon={<Icon>chevron_right</Icon>}
            defaultEndIcon={<Icon>article</Icon>}
            sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
        >
            {root && <FileTreeNode node={root} onNew={handleNew} />}
        </TreeView>
    );
};

export default Controllers;

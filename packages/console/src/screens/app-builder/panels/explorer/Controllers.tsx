import { useCallback, useMemo } from "react";

import { TreeView } from "@mui/lab";

import FileTreeNode from "./FileTreeNode";
import { gql, useMutation, useQuery } from "@apollo/client";
import { createPathTree } from "../../../../utils/files";
import { useBuilderActions, useParam } from "../../../../hooks";
import { Icon, styled } from "@mui/material";
import { INewFileOptions, IPath, IPathNode } from "../../../../types";

const StyledTreeView = styled(TreeView)`
    height: 264px;
    flexgrow: 1;
    overflowy: "auto";
`;

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
    const root = useMemo(() => createPathTree(records), [records]) as IPathNode;

    const [createSourceFile] = useMutation(CREATE_SOURCE_FILE, {
        refetchQueries: ["GetApp"],
    });

    const { createTab } = useBuilderActions();

    const handleNew = useCallback(
        (options: INewFileOptions) => {
            const create = (
                name: string,
                directory: boolean,
                parent: IPathNode,
                content?: string,
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

            const { name, type, parent } = options;

            switch (type) {
                case "folder": {
                    create(name, true, parent);
                    break;
                }

                case "regular_file": {
                    create(name, false, parent);
                    break;
                }

                case "screen": {
                    console.log("newPath", `/${name}/${name}.htx`);
                    // TODO: Move multiple calls operations to the API for atomicity.
                    create(`/${name}`, true, parent);
                    create(
                        `/${name}/${name}.htx`,
                        false,
                        parent,
                        EMPTY_SCREEN_HTX_TEMPLATE,
                    );
                    create(
                        `/${name}/${name}.css`,
                        false,
                        parent,
                        EMPTY_SCREEN_CSS_TEMPLATE,
                    );
                    create(
                        `/${name}/${name}.js`,
                        false,
                        parent,
                        EMPTY_SCREEN_JS_TEMPLATE,
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

    const handleEdit = useCallback(
        (path: IPath) => {
            const { name } = path;
            const extension = name.substring(name.lastIndexOf("."));
            createTab(
                extension === ".htx"
                    ? "app-builder.edit-screen"
                    : "app-builder.edit-source-file",
                { sourceFileId: path.name },
            );
        },
        [createTab],
    );

    return (
        <StyledTreeView
            defaultExpanded={["1"]}
            defaultCollapseIcon={<Icon>keyboard_arrow_down</Icon>}
            defaultExpandIcon={<Icon>chevron_right</Icon>}
            defaultEndIcon={<Icon>article</Icon>}
        >
            {root && (
                <FileTreeNode
                    node={root}
                    onNew={handleNew}
                    onEdit={handleEdit}
                />
            )}
        </StyledTreeView>
    );
};

export default Controllers;

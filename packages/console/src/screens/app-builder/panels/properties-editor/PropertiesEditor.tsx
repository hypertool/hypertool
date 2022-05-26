import { createElement, useCallback } from "react";
import type { FunctionComponent, ReactElement } from "react";

import { Button, styled } from "@mui/material";

import { gql, useMutation } from "@apollo/client";

import { useEditor } from "../../../../craft";
import { useNotification, useTabBundle } from "../../../../hooks";
import { IEditScreenBundle } from "../../../../types";

const Root = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
}));

const Properties = styled("div")(({ theme }) => ({
    minHeight: "calc(100vh - 166px)",
}));

const Actions = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
}));

const UPDATE_SCREEN = gql`
    mutation UpdateScreen($screenId: ID!, $content: String!) {
        updateScreen(screenId: $screenId, content: $content) {
            id
        }
    }
`;

const PropertiesEditor: FunctionComponent = (): ReactElement => {
    const { selected, query } = useEditor((state) => {
        const currentNodeId: Set<string> = state.events.selected;
        if (currentNodeId) {
            const id = currentNodeId.values().next().value;
            const node = state.nodes[id];
            if (node) {
                return {
                    selected: {
                        id,
                        name: node.data?.name,
                        settings: node.related?.settings,
                    },
                };
            }
        }

        return {
            selected: false,
        };
    }) as any;

    const bundle = useTabBundle<IEditScreenBundle>();
    const notification = useNotification();
    const [updateScreen] = useMutation(UPDATE_SCREEN, {
        refetchQueries: ["GetScreen"],
    });

    const handleSave = useCallback(async () => {
        try {
            const content = query.serialize();
            await updateScreen({
                variables: {
                    screenId: bundle.screenId,
                    content,
                },
            });
        } catch (error: any) {
            notification.notifyError(error);
        }
    }, [query, updateScreen, bundle, notification]);

    return (
        <Root>
            <Properties>
                {selected?.settings &&
                    createElement((selected as any).settings)}
            </Properties>
            <Actions>
                <Button
                    variant="contained"
                    fullWidth={true}
                    type="submit"
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Actions>
        </Root>
    );
};

export default PropertiesEditor;

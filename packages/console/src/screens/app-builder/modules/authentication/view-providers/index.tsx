import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import { styled } from "@mui/material/styles";

import { NoRecords } from "../../../../../components";
import { useBuilderActions, useUpdateTabTitle } from "../../../../../hooks";
import { IProviderConfiguration } from "../../../../../types";

import ProvidersTable from "./ProvidersTable";
import ProvidersToolbar from "./ProvidersToolbar";

const ProvidersContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
}));

const configurations: IProviderConfiguration[] = [
    /*
     * {
     *     id: "627a94ced14773e913227a34",
     *     type: "email_password",
     *     status: "enabled",
     *     createdAt: new Date(),
     *     updatedAt: new Date(),
     * },
     * {
     *     id: "627a94ced14773e913227a28",
     *     type: "anonymous",
     *     status: "disabled",
     *     createdAt: new Date(),
     *     updatedAt: new Date(),
     * },
     */
];

const ViewProviders: FunctionComponent = (): ReactElement => {
    useUpdateTabTitle("View Providers");
    const { createTab } = useBuilderActions();

    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = useCallback((newSelected: string[]) => {
        setSelected(newSelected);
    }, []);

    const handleNew = useCallback(() => {
        createTab("authentication.new-provider");
    }, [createTab]);

    return (
        <div>
            <ProvidersToolbar
                selectedCount={selected.length}
                onNew={handleNew}
            />
            {configurations.length > 0 && (
                <ProvidersContainer>
                    <ProvidersTable
                        configurations={configurations}
                        selected={selected}
                        onSelect={handleSelect}
                    />
                </ProvidersContainer>
            )}
            {configurations.length === 0 && (
                <NoRecords
                    message="We tried our best, but couldn't find any authentication providers."
                    image="https://res.cloudinary.com/hypertool/image/upload/v1649822115/hypertool-assets/empty-organizations_qajazk.svg"
                    actionText="Create New Provider"
                    actionIcon="add_circle_outline"
                    onAction={handleNew}
                />
            )}
        </div>
    );
};

export default ViewProviders;

import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import { styled } from "@mui/material/styles";

import { useUpdateTabTitle } from "../../../../../hooks";
import { IProviderConfiguration } from "../../../../../types";

import ProvidersTable from "./ProvidersTable";
import ProvidersToolbar from "./ProvidersToolbar";

const ProvidersContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
}));

const configurations: IProviderConfiguration[] = [
    {
        id: "627a94ced14773e913227a34",
        type: "email_password",
        status: "enabled",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "627a94ced14773e913227a28",
        type: "anonymous",
        status: "disabled",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const ViewProviders: FunctionComponent = (): ReactElement => {
    useUpdateTabTitle("View Providers");

    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = useCallback((newSelected: string[]) => {
        setSelected(newSelected);
    }, []);

    return (
        <div>
            <ProvidersToolbar selectedCount={selected.length} />
            <ProvidersContainer>
                <ProvidersTable
                    configurations={configurations}
                    selected={selected}
                    onSelect={handleSelect}
                />
            </ProvidersContainer>
        </div>
    );
};

export default ViewProviders;

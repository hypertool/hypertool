import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import { styled } from "@mui/material/styles";

import { NoRecords } from "../../../../../components";
import { useBuilderActions, useUpdateTabTitle } from "../../../../../hooks";
import { IUser } from "../../../../../types";

import UsersTable from "./UsersTable";
import UsersToolbar from "./UsersToolbar";

const UsersContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
}));

const users: IUser[] = [
    /*
     * {
     *     id: "627a94ced14773e913227a34",
     *     firstName: "Samuel",
     *     lastName: "Rowe",
     *     emailAddress: "samuel@hypertool.io",
     *     status: "enabled",
     *     createdAt: new Date(),
     *     updatedAt: new Date(),
     * },
     */
];

const ViewUsers: FunctionComponent = (): ReactElement => {
    useUpdateTabTitle("View Users");
    const { createTab } = useBuilderActions();

    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = useCallback((newSelected: string[]) => {
        setSelected(newSelected);
    }, []);

    const handleNew = useCallback(() => {
        createTab("authentication.new-user");
    }, [createTab]);

    return (
        <div>
            <UsersToolbar selectedCount={selected.length} onNew={handleNew} />
            {users.length > 0 && (
                <UsersContainer>
                    <UsersTable
                        configurations={users}
                        selected={selected}
                        onSelect={handleSelect}
                    />
                </UsersContainer>
            )}
            {users.length === 0 && (
                <NoRecords
                    message="We tried our best, but couldn't find any users."
                    image="https://res.cloudinary.com/hypertool/image/upload/v1649822115/hypertool-assets/empty-organizations_qajazk.svg"
                    actionText="Create New User"
                    actionIcon="add_circle_outline"
                    onAction={handleNew}
                />
            )}
        </div>
    );
};

export default ViewUsers;

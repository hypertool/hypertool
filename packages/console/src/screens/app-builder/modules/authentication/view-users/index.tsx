import type { FunctionComponent, ReactElement } from "react";
import { useCallback, useState } from "react";

import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

import { gql, useQuery } from "@apollo/client";

import { NoRecords } from "../../../../../components";
import {
    useBuilderActions,
    useParam,
    useUpdateTabTitle,
} from "../../../../../hooks";

import UsersTable from "./UsersTable";
import UsersToolbar from "./UsersToolbar";

const UsersContainer = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
}));

const ProgressContainer = styled("div")(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "calc(100vh - 104px)",
}));

const GET_USERS = gql`
    query GetUsers($app: ID!, $page: Int, $limit: Int) {
        getUsers(app: $app, page: $page, limit: $limit) {
            totalPages
            records {
                id
                firstName
                lastName
                emailAddress
                status
                createdAt
                updatedAt
            }
        }
    }
`;

const ViewUsers: FunctionComponent = (): ReactElement => {
    useUpdateTabTitle("View Users");
    const { createTab } = useBuilderActions();
    const appId = useParam("appId");

    const { data, loading, refetch } = useQuery(GET_USERS, {
        variables: {
            app: appId,
            page: 0,
            limit: 20,
        },
        notifyOnNetworkStatusChange: true,
    });
    const { records: users } = data?.getUsers || { records: [] };

    const [selected, setSelected] = useState<string[]>([]);

    const handleEdit = useCallback((userId: string) => {
        createTab("authentication.edit-user", { userId });
    }, []);

    const handleSelect = useCallback((newSelected: string[]) => {
        setSelected(newSelected);
    }, []);

    const handleNew = useCallback(() => {
        createTab("authentication.new-user");
    }, [createTab]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <div>
            <UsersToolbar
                selectedCount={selected.length}
                onNew={handleNew}
                onRefresh={handleRefresh}
            />
            {!loading && users.length > 0 && (
                <UsersContainer>
                    <UsersTable
                        configurations={users}
                        selected={selected}
                        onSelect={handleSelect}
                        onEdit={handleEdit}
                    />
                </UsersContainer>
            )}
            {!loading && users.length === 0 && (
                <NoRecords
                    message="We tried our best, but couldn't find any users."
                    image="https://res.cloudinary.com/hypertool/image/upload/v1649822115/hypertool-assets/empty-organizations_qajazk.svg"
                    actionText="Create New User"
                    actionIcon="add_circle_outline"
                    onAction={handleNew}
                />
            )}
            {loading && (
                <ProgressContainer>
                    <CircularProgress size="28px" />
                </ProgressContainer>
            )}
        </div>
    );
};

export default ViewUsers;

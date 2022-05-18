import type { ChangeEvent, FunctionComponent, ReactElement } from "react";

import { Checkbox, TableCell, TableHead, TableRow } from "@mui/material";

interface HeadCell {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
}

const headCells: HeadCell[] = [
    {
        id: "identifier",
        numeric: false,
        disablePadding: false,
        label: "Identifier",
    },
    {
        id: "Name",
        numeric: false,
        disablePadding: false,
        label: "Name",
    },
    {
        id: "emailAddress",
        numeric: false,
        disablePadding: false,
        label: "Email Address",
    },
    {
        id: "status",
        numeric: false,
        disablePadding: false,
        label: "Status",
    },
    {
        id: "createdAt",
        numeric: false,
        disablePadding: false,
        label: "Created At",
    },
];

export interface IUsersTableHeadProps {
    selectedCount: number;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
}

const UsersTableHead: FunctionComponent<IUsersTableHeadProps> = (
    props: IUsersTableHeadProps,
): ReactElement => {
    const { onSelectAllClick, selectedCount, rowCount } = props;
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            selectedCount > 0 && selectedCount < rowCount
                        }
                        checked={rowCount > 0 && selectedCount === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default UsersTableHead;

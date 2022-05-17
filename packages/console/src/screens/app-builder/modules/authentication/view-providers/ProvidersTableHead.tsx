import type { ChangeEvent, FunctionComponent, ReactElement } from "react";

import { Checkbox, TableCell, TableHead, TableRow } from "@mui/material";

interface HeadCell {
    id: string;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
}

const headCells: readonly HeadCell[] = [
    {
        id: "provider",
        numeric: false,
        disablePadding: true,
        label: "Provider",
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

export interface IProvidersTableHeadProps {
    selectedCount: number;
    onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
}

const ProvidersTableHead: FunctionComponent<IProvidersTableHeadProps> = (
    props: IProvidersTableHeadProps,
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

export default ProvidersTableHead;

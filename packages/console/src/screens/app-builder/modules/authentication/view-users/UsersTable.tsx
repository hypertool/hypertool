import type {
    ChangeEvent,
    FunctionComponent,
    MouseEvent,
    ReactElement,
} from "react";

import {
    Checkbox,
    Icon,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
    styled,
} from "@mui/material";

import { DateTime } from "luxon";

import UsersTableHead from "./UsersTableHead";

const Status = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(1),
}));

const DateTimeText = styled(Typography)(({ theme }) => ({
    fontSize: 14,
}));

export interface IUsersTableProps {
    configurations: any[];
    selected: string[];
    onSelect: (newSelected: string[]) => void;
    onEdit: (id: string) => void;
}

const detailsByStatus: Record<string, any> = {
    invited: {
        title: "Invited",
        icon: "send",
    },
    cancelled: {
        title: "Cancelled",
        icon: "cancel_circle_outline",
    },
    activated: {
        title: "Activated",
        icon: "check_circle_outline",
    },
    deleted: {
        title: "Deleted",
        icon: "delete",
    },
};

const UsersTable: FunctionComponent<IUsersTableProps> = (
    props: IUsersTableProps,
): ReactElement => {
    const { configurations, selected, onSelect, onEdit } = props;

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        onSelect(
            event.target.checked ? configurations.map((row) => row.id) : [],
        );
    };

    const handleEdit = (id: string) => () => {
        onEdit(id);
    };

    const handleSelect = (event: MouseEvent<unknown>, name: string) => {
        event.stopPropagation();

        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        onSelect(newSelected);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const renderStatus = (status: string) => {
        const details = detailsByStatus[status];
        return (
            <Status>
                <Icon fontSize="small">{details.icon}</Icon>
                {details.title}
            </Status>
        );
    };

    const renderDate = (date: string) => (
        <DateTimeText>
            {DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT)}
        </DateTimeText>
    );

    return (
        <Paper>
            <TableContainer>
                <Table sx={{ minWidth: 750 }} size="medium">
                    <UsersTableHead
                        selectedCount={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                        rowCount={configurations.length}
                    />
                    <TableBody>
                        {configurations.map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover={true}
                                    onClick={handleEdit(row.id)}
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            onClick={(event) =>
                                                handleSelect(event, row.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.firstName} {row.lastName}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.emailAddress}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {renderStatus(row.status)}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {renderDate(row.createdAt)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default UsersTable;

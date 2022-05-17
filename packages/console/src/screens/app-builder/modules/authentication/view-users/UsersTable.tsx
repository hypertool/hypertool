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
}

const detailsByType: Record<string, any> = {
    email_password: {
        title: "Email / Password",
    },
    anonymous: {
        title: "Anonymous",
    },
};

const detailsByStatus: Record<string, any> = {
    enabled: {
        title: "Enabled",
        icon: "check_circle_outline",
    },
    disabled: {
        title: "Disabled",
        icon: "cancel_circle_outline",
    },
};

const UsersTable: FunctionComponent<IUsersTableProps> = (
    props: IUsersTableProps,
): ReactElement => {
    const { configurations, selected, onSelect } = props;

    const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
        onSelect(
            event.target.checked ? configurations.map((row) => row.id) : [],
        );
    };

    const handleSelect = (event: MouseEvent<unknown>, name: string) => {
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

    const renderDate = (date: Date) => (
        <DateTimeText>
            {DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_SHORT)}
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
                                    onClick={(event) =>
                                        handleSelect(event, row.id)
                                    }
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                        />
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                    >
                                        {detailsByType[row.type].title}
                                    </TableCell>
                                    <TableCell>
                                        {renderStatus(row.status)}
                                    </TableCell>
                                    <TableCell>
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

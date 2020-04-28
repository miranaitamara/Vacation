import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Button } from '@material-ui/core';
import { Context } from '../../stores/globalStore';
import axios from 'axios';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const OrdersTable = () => {
    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const vacations = [...state.userStatus.userVacations]

    const createData = (id, name, status, laststatuschange) => {
        return { id, name, status, laststatuschange };
    }

    const columns = [
        { id: 'id', label: 'Order ID', minWidth: 50 },
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'status', label: 'Order Status', minWidth: 100 },
        {
            id: 'laststatuschange',
            label: 'Last Change Date',
            minWidth: 170,
        },
    ];

    const rows = vacations.map(vacation => {
        return createData(vacation.orderId, vacation.Name, vacation.Status, vacation.lastStatusChange)
    });

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    const onRefundClick = (e) => {
        e.preventDefault()
        const orderId = e.currentTarget.id
        const vacationId = orderId.split('$')[1]
        axios.put('http://localhost:8000/vacations/' + vacationId + '/refund', {}, {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                const vacationIndex = vacations.findIndex(vacation => vacation.orderId === orderId)
                vacations[vacationIndex].Status = 'pending refund';
                const d = new Date();
                const dformat =
                    [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
                    + ' ' +
                    [d.getHours(), d.getMinutes()].join(':');
                vacations[vacationIndex].lastStatusChange = dformat
                dispatch({ type: 'UPDATE_VACATIONS_DATA', payload: vacations });
            })
            .catch(error => {
                console.log(error)
            });
    }
    const onCancelRefundClick = (e) => {
        e.preventDefault()
        const orderId = e.currentTarget.id
        const vacationId = orderId.split('$')[1]
        axios.put('http://localhost:8000/vacations/' + vacationId + '/cancelrefund', {}, {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                let vacationIndex = vacations.findIndex(vacation => vacation.orderId === orderId)
                vacations[vacationIndex].Status = 'approved'
                const d = new Date();
                const dformat =
                        [d.getFullYear(), (d.getMonth() + 1), d.getDate()].join('-')
                        + ' ' +
                        [d.getHours(), d.getMinutes()].join(':');
                vacations[vacationIndex].lastStatusChange = dformat
                dispatch({ type: 'UPDATE_VACATIONS_DATA', payload: vacations });
            })
            .catch(error => {
                console.log(error)
            });
    }


    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, backgroundColor: '#3f51b5', color: '#fff' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell
                                align='center'
                                style={{ minWidth: 50, backgroundColor: '#3f51b5', color: '#fff' }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow id={row.id} hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell>
                                        {row.status === 'approved' &&
                                            <Button
                                                id={row.id}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                onClick={onRefundClick}>
                                                Refund
                                            </Button>
                                        }
                                        {row.status === 'pending refund' &&
                                            <Button
                                                id={row.id}
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={onCancelRefundClick}>
                                                Cancel Refund
                                            </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default OrdersTable;
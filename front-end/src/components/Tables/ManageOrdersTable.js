import React, { useReducer, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Button } from '@material-ui/core';
import manageOrdersReducer from '../../reducers/manageOrdersReducer'
import axios from 'axios';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const ManageOrdersTable = () => {
    const classes = useStyles();

    const initialState = {
        orders: [],
        error: false,
    };

    const [state, dispatch] = useReducer(manageOrdersReducer, initialState);

    useEffect(() => {
        axios.get('http://localhost:8000/admin/orders', {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                dispatch({ type: 'SET_DATA', payload: response.data.data });
            })
            .catch(error => {
                console.log(error)
            });
    }, [])
    const createData = (id, userId, vacationId, userEmail, orderDate, lastChangeStatus, status) => {
        return { id, userId, vacationId, userEmail, orderDate, lastChangeStatus, status };
    }

    const columns = [
        { id: 'id', label: 'Order #', minWidth: 50 },
        { id: 'userId', label: 'User #', minWidth: 40 },
        { id: 'vacationId', label: 'Vacation #', minWidth: 40 },
        { id: 'userEmail', label: 'User Email', minWidth: 100 },
        { id: 'orderDate', label: 'Order Date', minWidth: 100 },
        { id: 'lastChangeStatus', label: 'Last Change', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 70 },

    ];

    const rows = state.orders.map(order => {
        return createData(order.id, order.user_id, order.vacation_id, order.userEmail, order.orderDate, order.lastChangeStatus, order.status)
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

    const onAcceptRefund = (e) => {
        e.preventDefault()
        const orderId = e.currentTarget.id
        const vacationId = orderId.split('$')[1]
        axios.delete('http://localhost:8000/admin/orders/' + vacationId + '/refund', {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                const _orders = [...state.orders]
                const _ordersIndex = _orders.findIndex(order => order.id === orderId)
                _orders.splice(_ordersIndex, 1)
                dispatch({ type: 'SET_DATA', payload: _orders });
            })
            .catch(error => {
                console.log(error)
            });
    }
    const onApprove = (e) => {
        e.preventDefault()
        const orderId = e.currentTarget.id
        const vacationId = orderId.split('$')[1]
        axios.put('http://localhost:8000/admin/orders/' + vacationId + '/approve', {}, {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                const _orders = [...state.orders]
                const _ordersIndex = _orders.findIndex(order => order.id === orderId)
                _orders[_ordersIndex].status = 'approved';
                const d = new Date();
                const dformat =
                    [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
                    + ' ' +
                    [d.getHours(), d.getMinutes()].join(':');
                _orders[_ordersIndex].lastChangeStatus = dformat;
                dispatch({ type: 'SET_DATA', payload: _orders });
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
                                    align='center'
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
                                        {row.status === 'pending refund' &&
                                            <Button
                                                id={row.id}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                onClick={onAcceptRefund}>
                                                Accept Refund
                                            </Button>
                                        }
                                        {row.status === 'pending approval' &&
                                            <Button
                                                id={row.id}
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={onApprove}>
                                                Approve
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

export default ManageOrdersTable;
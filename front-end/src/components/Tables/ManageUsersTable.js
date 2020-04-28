import React, { useReducer, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Button } from '@material-ui/core';
import manageUsersReducer from '../../reducers/manageUsersReducer'
import axios from 'axios';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const ManageUsersTable = () => {
    const classes = useStyles();

    const initialState = {
        users: [],
        error: false,
    };

    const [state, dispatch] = useReducer(manageUsersReducer, initialState);

    useEffect(() => {
        axios.get('http://localhost:8000/users', {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                dispatch({ type: 'SET_DATA', payload: response.data.data });
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            });
    }, [])
    const createData = (id, Email, userType) => {
        return { id, Email, userType };
    }

    const columns = [
        { id: 'id', label: 'User #', minWidth: 50 },
        { id: 'Email', label: 'Email', minWidth: 40 },
        { id: 'userType', label: 'User Type', minWidth: 100 },
    ];

    const rows = state.users.map(user => {
        return createData(user.Id, user.Email, user.userType)
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

    const onSetAdmin = (e) => {
        e.preventDefault()
        const userId = e.currentTarget.id
        axios.put('http://localhost:8000/admin/setAdmin/' + userId, {}, {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                const _users = [...state.users]
                const _usersIndex = _users.findIndex(user => user.Id.toString() === userId)
                console.log(_users)
                console.log(_usersIndex)
                _users[_usersIndex].userType = 'admin'
                dispatch({ type: 'SET_DATA', payload: _users });
            })
            .catch(error => {
                console.log(error)
            });
    }
    const onRemoveAdmin = (e) => {
        e.preventDefault()
        const userId = e.currentTarget.id
        axios.put('http://localhost:8000/admin/removeAdmin/' + userId, {}, {
            withCredentials: true,
            credentials: 'include',
        })
            .then(response => {
                const _users = [...state.users]
                const _usersIndex = _users.findIndex(user => user.Id.toString() === userId)
                _users[_usersIndex].userType = 'normal'
                dispatch({ type: 'SET_DATA', payload: _users });
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
                                style={{ minWidth: 100, backgroundColor: '#3f51b5', color: '#fff' }}>
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
                                        {row.userType === 'admin' &&
                                            <Button
                                                id={row.id}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                onClick={onRemoveAdmin}>
                                                Remove Admin
                                            </Button>
                                        }
                                        {row.userType === 'normal' &&
                                            <Button
                                                id={row.id}
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={onSetAdmin}>
                                                Set Admin
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

export default ManageUsersTable;
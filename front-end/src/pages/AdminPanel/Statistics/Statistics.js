import React, { useEffect, useContext } from 'react';
import { Context } from '../../../stores/globalStore';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core'

import axios from 'axios'

import OrdersGraph from '../../../components/Graphs/OrdersGraph'

const Statistics = () => {

    // const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const history = useHistory()

    /* Checks if user has data and is logged in*/
    useEffect(() => {
        if (!state.userStatus.userCheckedIn || !state.userStatus.userType) {
            axios.get('http://localhost:8000/users/profile', {
                withCredentials: true,
                credentials: 'include',
            })
                .then(response => {
                    dispatch({ type: 'SET_DATA', payload: response.data.data[0] });
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOGGED_OUT' });
                    history.push('/login')
                });
        } else if (!state.userStatus.isLoggedIn)
            history.push('/login')
        else if (state.userStatus.userType !== 'admin')
            history.push('')
    }, [dispatch, history, state.userStatus.userCheckedIn, state.userStatus.isLoggedIn, state.userStatus.userType]);


    return (
        !state.userStatus.isLoggedIn || state.userStatus.userType !== 'admin' || !state.userStatus.userCheckedIn ? '' :
            <div className='statistics-p'>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                >
                    <OrdersGraph type='pie'/>
                    <OrdersGraph type='column'/>
                    <OrdersGraph type='line'/>
                </Grid>

            </div>
    )
}


export default Statistics

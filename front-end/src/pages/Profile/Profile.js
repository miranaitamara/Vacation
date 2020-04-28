import React, { useEffect, useContext } from 'react';
import { Context } from '../../stores/globalStore';
import { useHistory } from 'react-router-dom';
import { Grid, Typography, Avatar } from '@material-ui/core'

import OrdersTable from '../../components/Tables/OrdersTable'
import axios from 'axios'


const Profile = () => {

    const [state, dispatch] = useContext(Context);
    const history = useHistory()

    /* Checks if user has data and is logged in*/
    useEffect(() => {
        if (!state.userStatus.isLoggedIn && state.userStatus.userCheckedIn)
            history.push('/login')
        else {
            axios.get('http://localhost:8000/users/profile', {
                withCredentials: true,
                credentials: 'include',
            })
                .then(response => {
                    console.log(response.data.data[0])
                    dispatch({ type: 'SET_DATA', payload: response.data.data[0] });
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOGGED_OUT' });
                    history.push('/login')
                });
        }

    }, [dispatch, history, state.userStatus.userCheckedIn, state.userStatus.isLoggedIn, state.userStatus.userType]);


    return (
        !state.userStatus.isLoggedIn || !state.userStatus.userType || !state.userStatus.userCheckedIn ? '' :
            <div className='profile-p'>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '80vh' }}
                >
                    <Avatar>{state.userStatus.userEmail[0]}</Avatar>
                    <Typography paragraph variant="h4" component="h4">
                        {state.userStatus.userEmail}
                    </Typography>

                    <Typography paragraph variant="h5" component="h5">
                        Orders History
                    </Typography>
                    <OrdersTable />
                </Grid>

            </div>
    )
}


export default Profile

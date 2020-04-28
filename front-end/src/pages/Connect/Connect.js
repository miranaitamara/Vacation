import React, { useEffect, useContext } from 'react';
import Login from '../../components/Forms/Login'
import Register from '../../components/Forms/Register'
import { Grid } from '@material-ui/core'
import mainLogo from '../../images/ivacation.png'
import { Context } from '../../stores/globalStore'
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import './Connect.css';

const Connect = (props) => {
    const history = useHistory()
    const [state, dispatch] = useContext(Context)

    useEffect(() => {
        if (!state.userStatus.userCheckedIn) {
            axios.get('http://localhost:8000/users/profile', {
                withCredentials: true,
                credentials: 'include',
            })
                .then(response => {
                    dispatch({ type: 'SET_DATA', payload: response.data.data[0] });
                    history.push('/')
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOGGED_OUT' });
                });
        } else if (state.userStatus.isLoggedIn)
            history.push('/')
    }, [state.userStatus.userCheckedIn, state.userStatus.isLoggedIn, history, dispatch]);

    return (
        !state.userStatus.userCheckedIn || state.userStatus.isLoggedIn ? '' :
            <div className='connect-p'>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '80vh' }}
                >
                    <img className='logo-img' src={mainLogo} alt='site logo' />
                    {props.formType === 'login' && <Login />}
                    {props.formType === 'register' && <Register />}
                </Grid>
            </div>
    )

}

export default Connect
